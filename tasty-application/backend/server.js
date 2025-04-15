// backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment.');
}
if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in your environment.');
}

// Enable CORS (allow access from any domain)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB with a longer timeout for serverless environments
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define User schema and model (using the "users" collection)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },        // New field for signup
  email: { type: String, required: true },
  password: { type: String, required: true }       // Will store hashed password
});
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

// (Optional) Root route for quick verification
app.get('/', (req, res) => {
  res.send('Express API is running.');
});

// Test endpoint: fetch all users (for debugging)
app.get('/api/test-db', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* 
  Signup Endpoint
  - Validates input
  - Checks for existing user
  - Hashes the password with bcrypt (10 salt rounds)
  - Creates and saves the new user
  - Optionally, returns a JWT token (for auto-login, if desired)
*/
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Name, email and password are required." });
  }
  
  try {
    // Check if a user with the same email exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists." });
    }
    
    // Hash the password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    // Optionally, sign the user in automatically by generating a JWT token:
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/* 
  Login Endpoint
  - Validates input
  - Finds the user by email
  - Uses bcrypt.compare to verify the provided plain-text password
    against the hashed password stored in the database
  - If valid, generates and returns a JWT token.
*/
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate the request body
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }
  
  try {
    // Find the user with the provided email
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }
    
    // Compare the plain-text password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }
    
    // Generate a JWT token valid for 1 hour
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
