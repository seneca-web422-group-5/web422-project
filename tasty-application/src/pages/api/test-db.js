// pages/api/test-db.js
import dbConnect from '../../lib/db';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

export default async function handler(req, res) {
  try {
    await dbConnect();
    const users = await User.find({}).lean();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
