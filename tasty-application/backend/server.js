require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
// API_URL is not used on the backend
// const API_URL = process.env.REACT_APP_API_URL;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment.');
}
if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in your environment.');
}

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}


app.use(cors()); // Allow all origins

// Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB with a longer timeout for serverless environments
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define User schema and model (collection: "users")
// New schema includes bio, title, location, instagram, and lastLogin.
// Timestamps option automatically adds createdAt and updatedAt.
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  title: { type: String, default: "" },
  location: { type: String, default: "" },
  instagram: { type: String, default: "" },
  favorites: [
    {
      id: String,
      name: String,
      thumbnail_url: String,
    },
  ],
  lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

// Root route for quick verification
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


// ------------------Category-Images Schema------------------
const CategoryImageSchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const CategoryImage = mongoose.models.CategoryImage || mongoose.model('CategoryImage', CategoryImageSchema, 'CategoryImages');

// ------------------ Seeding to get Category-Images on the back end ------------------
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.post('/api/seed-category-images', async (req, res) => {
  const apiKey = process.env.RAPID_API_KEY;
  if (!apiKey) return res.status(500).json({ success: false, error: 'Missing RAPID_API_KEY' });

  try {
    const tagsRes = await fetch('https://tasty.p.rapidapi.com/tags/list', {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
      },
    });
    const tagData = await tagsRes.json();
    const tagResults = tagData?.results;

    if (!Array.isArray(tagResults)) {
      return res.status(500).json({ success: false, error: 'Invalid tag data from API' });
    }

    const savedImages = [];

    const normalize = (str) =>
      str?.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '');

    for (const category of tagResults) {
      const normalizedId = normalize(category.name);
      const existing = await CategoryImage.findOne({ categoryId: normalizedId });
      if (existing) continue;

      const searchRes = await fetch(
        `https://tasty.p.rapidapi.com/recipes/list?from=0&size=10&tags=${category.display_name}`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
          },
        }
      );
      const recipeData = await searchRes.json();
      const recipes = recipeData?.results || [];
      if (!recipes.length) continue;

      const found = recipes.find((r) => r.thumbnail_url);
      if (found?.thumbnail_url) {
        const saved = await CategoryImage.create({
          categoryId: normalizedId,
          category: category.display_name,
          imageUrl: found.thumbnail_url,
        });
        savedImages.push(saved);
      }

      await new Promise((res) => setTimeout(res, 200));
    }

    res.status(200).json({ success: true, count: savedImages.length, data: savedImages });
  } catch (error) {
    console.error('Seeder error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------ Category-Images Endpoint ------------------
app.get('/api/category-images', async (req, res) => {
  try {
    const images = await CategoryImage.find({}).lean();
    res.status(200).json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// ------------------Random-Recipe Schema------------------
const RecipeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  description: String,
  thumbnail_url: String,
  created_at: Number,
}, { timestamps: true })

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema, 'randomRecipes')


app.post('/api/seed-random-recipes', async (req, res) => {
  const apiKey = process.env.RAPID_API_KEY;
  if (!apiKey) return res.status(500).json({ success: false, error: 'Missing RAPID_API_KEY' });

  try {
    const searchRes = await fetch(
      'https://tasty.p.rapidapi.com/recipes/list?from=0&size=50',
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
        },
      }
    );

    const data = await searchRes.json();
    const validRecipes = (data.results || []).filter(r => r.thumbnail_url && r.name);

    const random5 = validRecipes.sort(() => 0.5 - Math.random()).slice(0, 5);

    const saved = [];

    for (const recipe of random5) {
      const exists = await Recipe.findOne({ id: recipe.id });
      if (!exists) {
        const doc = await Recipe.create({
          id: recipe.id,
          name: recipe.name,
          description: recipe.description || '',
          thumbnail_url: recipe.thumbnail_url,
          created_at: recipe.created_at,
        });
        saved.push(doc);
      }
    }

    res.status(200).json({ success: true, count: saved.length, data: saved });
  } catch (err) {
    console.error('Error seeding random recipes:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------ Random Recipes Endpoint ------------------
app.get('/api/random-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({}).lean();
    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// ------------------ Favorite-Related Endpoints ------------------
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { id, name, thumbnail_url } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'Missing recipe data.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    // Check if already favorited
    const alreadyFavorited = user.favorites.some(fav => fav.id === id);
    if (alreadyFavorited) {
      return res.status(400).json({ success: false, error: 'Recipe already in favorites.' });
    }
    user.favorites.push({ id, name, thumbnail_url });
    await user.save();
    res.status(201).json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    user.favorites = user.favorites.filter(fav => fav.id !== id);
    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// ------------------ Profile-Related Endpoints ------------------

// GET /api/auth/profile - Return the profile data for the authenticated user
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    delete user.password;
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/auth/update-profile - Update personal info
app.put('/api/auth/update-profile', authenticateToken, async (req, res) => {
  const { name, bio, title, location, instagram } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (title !== undefined) user.title = title;
    if (location !== undefined) user.location = location;
    if (instagram !== undefined) user.instagram = instagram;
    
    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/auth/change-password - Change password (requires old password)
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, error: "Both old and new passwords are required." });
  }
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Old password is incorrect." });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/community', async (req, res) => {
  try {
    // Exclude password and __v fields from each document
    const users = await User.find({}, { password: 0, __v: 0 }).lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------ Authentication Endpoints ------------------

// Signup Endpoint
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
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Login Endpoint
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
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }
    
    // Update lastLogin field
    await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });
    
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
