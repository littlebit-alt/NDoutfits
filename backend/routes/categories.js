const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'ndoutfits-categories', allowed_formats: ['jpg', 'png', 'webp'] },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const cats = await Category.find().sort({ createdAt: 1 });
  res.json(cats);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file?.path || '';
    const cat = await Category.create({ name: req.body.name, imageUrl });
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updates = { name: req.body.name };
    if (req.file) updates.imageUrl = req.file.path;
    const cat = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;    