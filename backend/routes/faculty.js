const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const faculty = [
      {
        _id: 1,
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        department: 'Computer Science',
        subjects: ['Data Structures', 'Algorithms'],
        workload: 12,
        building: 'IT Building',
        officeHours: 'Mon-Wed 2-4 PM',
        phone: '+1 (555) 123-4567'
      }
    ];
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Faculty created successfully', data: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;