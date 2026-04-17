const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { productId, quantity, name, phone, wilaya, commune, notes, selectedPointure, selectedTaille, deliveryType, deliveryPrice, totalPrice } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const order = await Order.create({
      productId, productName: product.name, quantity,
      selectedPointure, selectedTaille,
      deliveryType: deliveryType || 'domicile',
      deliveryPrice: deliveryPrice || 0,
      name, phone, wilaya, commune, notes,
      totalPrice: totalPrice || (product.price * quantity)
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.patch('/:id/status', auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

router.delete('/:id', auth, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;