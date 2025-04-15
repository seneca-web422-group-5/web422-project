const mongoose = require('mongoose')

const CategoryImageSchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.models.CategoryImage || mongoose.model('CategoryImage', CategoryImageSchema)
