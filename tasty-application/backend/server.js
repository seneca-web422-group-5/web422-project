// backend/server.js

// Load environment variables (these will be replaced by Vercel during deployment)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Use the PORT provided by environment or default to 3001
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment.');
}
if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in your environment.');
}

// Use CORS middleware so that your API is accessible from any domain
app.use(cors());

// Parse JSON bodies in requests
app.use(express.json());

// Connect to MongoDB with increased timeout options for serverless environments
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000  // 10 seconds
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define a simple schema and model for the "users" collection
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

// Optional: Define a route at "/" to verify deployment if desired
app.get('/', (req, res) => {
  res.send('Express API is running.');
});

// Test endpoint to fetch users (for debugging)
app.get('/api/test-db', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login endpoint (using plain-text password comparison for testing only)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email }).lean();
    if (!user || password !== user.password) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
