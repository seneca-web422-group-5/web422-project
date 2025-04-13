import mongoose from 'mongoose';

const credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true,
  collection: 'credentials' // Explicit collection name
});

// Prevent model overwrite in Next.js
export default mongoose.models?.Credentials || mongoose.model('Credentials', credentialsSchema);