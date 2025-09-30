const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const subjects = [
      {
        _id: 1,
        name: "DAA",
        code: "DR2345",
        department: "Civil Engineering",
        credits: 4,
        type: "Core",
        description: "Design and Analysis of Algorithms"
      }
    ];
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Subject created successfully', data: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;