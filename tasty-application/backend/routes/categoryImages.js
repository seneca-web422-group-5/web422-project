const express = require('express')
const router = express.Router()
const CategoryImage = require('../models/CategoryImage')

// GET image for category
router.get('/:categoryId', async (req, res) => {
  try {
    const img = await CategoryImage.findOne({ categoryId: req.params.categoryId }).lean()
    res.status(200).json({ success: true, data: img })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST or update category image
router.post('/', async (req, res) => {
  const { categoryId, category, imageUrl } = req.body
  if (!categoryId || !category || !imageUrl) {
    return res.status(400).json({ success: false, error: "Missing data." })
  }

  try {
    const updated = await CategoryImage.findOneAndUpdate(
      { categoryId },
      { category, imageUrl },
      { new: true, upsert: true }
    )
    res.status(200).json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
