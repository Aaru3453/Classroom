const express = require('express');
const router = express.Router();

// Mock data for classrooms
router.get('/', async (req, res) => {
  try {
    const classrooms = [
      {
        _id: 1,
        code: "ADER2353",
        name: "Workshop - A wing",
        capacity: 20,
        building: "A wing",
        equipment: ["Projector"],
        status: "Available",
        type: "Workshop"
      },
      {
        _id: 2,
        code: "A101",
        name: "Lecture Hall - Main Academic Building",
        capacity: 60,
        building: "Main Academic Building",
        equipment: ["Projector", "Whiteboard", "Sound System"],
        status: "Available",
        type: "Lecture Hall"
      }
    ];
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Classroom created successfully', data: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;