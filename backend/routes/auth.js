const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    res.json({ message: 'Login successful', token: 'mock-token' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;