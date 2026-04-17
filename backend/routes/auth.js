const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  
  console.log('Received password:', password);
  console.log('Expected password:', process.env.ADMIN_PASSWORD);
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Wrong password' });
  }
  
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;