const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  quantity: { type: Number, default: 1 },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  wilaya: { type: String, required: true },
  commune: { type: String, required: true },
  notes: String,
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'cancelled'], default: 'pending' },
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);