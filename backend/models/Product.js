const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }], // multiple images
  rating: { type: Number, default: 5 },
  inStock: { type: Boolean, default: true },
  showPointure: { type: Boolean, default: false },
  showTaille: { type: Boolean, default: false },
  pointures: [{ type: String }], // e.g. ["36","37","38","39","40","41"]
  tailles: [{ type: String }],   // e.g. ["S","M","L","XL","XXL"]
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);