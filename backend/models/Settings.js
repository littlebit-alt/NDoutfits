const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: String }
});

module.exports = mongoose.model('Settings', SettingsSchema);