const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const batches = [
      {
        _id: 1,
        name: "Computer Science 2024",
        code: "CS2024",
        department: "Computer Science",
        semesters: []
      }
    ];
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Batch created successfully', data: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;