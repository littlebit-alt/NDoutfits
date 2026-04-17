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
  params: { folder: 'ndoutfits', allowed_formats: ['jpg','png','webp'] },
});
const upload = multer({ storage });

// GET all products (optionally filter by category)
router.get('/', async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET categories list (from products)
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

// POST create product — up to 6 images
router.post('/', auth, upload.array('images', 6), async (req, res) => {
  try {
    const { name, description, price, category, rating, showPointure, pointures, showTaille, tailles } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];
    const product = await Product.create({
      name, description, price, category,
      images,
      rating: Number(rating) || 5,
      showPointure: showPointure === 'true',
      pointures: pointures ? JSON.parse(pointures) : [],
      showTaille: showTaille === 'true',
      tailles: tailles ? JSON.parse(tailles) : [],
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', auth, upload.array('images', 6), async (req, res) => {
  try {
    const { name, description, price, category, rating, showPointure, pointures, showTaille, tailles, keepImages } = req.body;
    const newImages = req.files ? req.files.map(f => f.path) : [];
    const existing = keepImages ? JSON.parse(keepImages) : [];
    const images = [...existing, ...newImages];
    const updates = {
      name, description, price, category,
      images,
      rating: Number(rating) || 5,
      showPointure: showPointure === 'true',
      pointures: pointures ? JSON.parse(pointures) : [],
      showTaille: showTaille === 'true',
      tailles: tailles ? JSON.parse(tailles) : [],
    };
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;