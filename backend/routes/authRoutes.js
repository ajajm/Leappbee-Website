const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'adminpassword';

  if (username === expectedUsername && password === expectedPassword) {
    const token = jwt.sign(
      { username: expectedUsername },
      process.env.JWT_SECRET || 'supersecretjwtkeychangeinproduction',
      { expiresIn: '7d' }
    );
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});

module.exports = router;
