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

// Enable CORS (allow any domain)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB with slightly increased timeout
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

// Updated User schema for the "users" collection
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Stored as a bcrypt hash
  bio: { type: String, default: "" },
  title: { type: String, default: "" },
  location: { type: String, default: "" },
  instagram: { type: String, default: "" },
  lastLogin: { type: Date } // We'll update this on each successful login
}, { timestamps: true });  // Automatically creates createdAt and updatedAt fields

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

// Optional: Root route for quick verification
app.get('/', (req, res) => {
  res.send('Express API is running.');
});

// Test endpoint to fetch all users
app.get('/api/test-db', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Signup endpoint: creates a new user with hashed password
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Name, email and password are required." });
  }
  
  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists." });
    }
    
    // Hash the password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    // Optionally, generate a token for auto-login (or you can simply return a success response)
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Login endpoint: verifies user credentials, updates lastLogin, and returns a JWT token
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }
  
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }
    
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }
    
    // Update lastLogin for the user (do not include lean() here, so we can save the change)
    await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });
    
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Additional endpoints for favorites, etc. remain unchanged...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
