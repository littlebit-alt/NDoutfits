const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  quantity: { type: Number, default: 1 },
  selectedPointure: String,
  selectedTaille: String,
  deliveryType: { type: String, enum: ['domicile', 'desk'], default: 'domicile' },
  deliveryPrice: { type: Number, default: 0 },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  wilaya: { type: String, required: true },
  commune: { type: String, required: true },
  notes: String,
  status: { type: String, enum: ['pending','confirmed','delivered','cancelled'], default: 'pending' },
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);