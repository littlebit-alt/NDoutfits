const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
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
  params: { folder: 'dzshark', allowed_formats: ['jpg', 'png', 'webp'] },
});
const upload = multer({ storage });

// GET all products (optionally filter by category)
router.get('/', async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET categories list
router.get('/categories', async (req, res) => {
  const cats = await Product.distinct('category');
  res.json(cats);
});

// GET single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// POST create product (admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, rating } = req.body;
    const imageUrl = req.file?.path || '';
    const product = await Product.create({ name, description, price, category, imageUrl, rating });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.imageUrl = req.file.path;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;