const express = require('express');
const jwt = require('jsonwebtoken');
const Settings = require('../models/Settings');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;

  // Check if admin changed password in DB
  const dbPass = await Settings.findOne({ key: 'adminPassword' });
  const expectedPassword = dbPass?.value || process.env.ADMIN_PASSWORD;

  if (password !== expectedPassword) {
    return res.status(401).json({ message: 'Wrong password' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;