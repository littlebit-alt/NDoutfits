const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET a setting by key (public for whatsapp)
router.get('/:key', async (req, res) => {
  const s = await Settings.findOne({ key: req.params.key });
  res.json({ value: s?.value || '' });
});

// SET whatsapp number (admin)
router.post('/whatsapp', auth, async (req, res) => {
  const { value } = req.body;
  await Settings.findOneAndUpdate(
    { key: 'whatsapp' },
    { key: 'whatsapp', value },
    { upsert: true, new: true }
  );
  res.json({ message: 'Whatsapp updated' });
});

// CHANGE admin password (admin)
router.post('/password', auth, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ message: 'Password too short' });
  }
  // Store new password in settings (plain — matched same way as env)
  await Settings.findOneAndUpdate(
    { key: 'adminPassword' },
    { key: 'adminPassword', value: newPassword },
    { upsert: true, new: true }
  );
  res.json({ message: 'Password updated' });
});

module.exports = router;