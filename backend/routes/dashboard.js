const express = require('express');
const router = express.Router();

// Mock data for dashboard
router.get('/stats', async (req, res) => {
  try {
    res.json({
      totalClassrooms: 15,
      availableClassrooms: 8,
      totalFaculty: 24,
      availableFaculty: 18,
      totalSubjects: 45,
      totalBatches: 6,
      totalTimetables: 3,
      avgUtilization: 72
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/classroom-utilization', async (req, res) => {
  try {
    const utilizationData = [
      { name: "CS-101", utilization: 85, status: "Occupied" },
      { name: "CS-102", utilization: 60, status: "Available" },
      { name: "M-201", utilization: 45, status: "Available" },
      { name: "P-301", utilization: 75, status: "Occupied" },
      { name: "L-101", utilization: 90, status: "Occupied" },
      { name: "S-205", utilization: 30, status: "Available" }
    ];
    res.json(utilizationData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;