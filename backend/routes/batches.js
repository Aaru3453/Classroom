// const express = require('express');
// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const batches = [
//       {
//         _id: 1,
//         name: "Computer Science 2024",
//         code: "CS2024",
//         department: "Computer Science",
//         semesters: []
//       }
//     ];
//     res.json(batches);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     res.json({ message: 'Batch created successfully', data: req.body });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/auth');


router.use(protect);

router.get('/', batchController.getBatches);

router.get('/:id', batchController.getBatch);

router.post('/', authorize('admin'), batchController.createBatch);

router.put('/:id', authorize('admin'), batchController.updateBatch);

router.delete('/:id', authorize('admin'), batchController.deleteBatch);


router.put('/:id/semesters/:semesterId/subjects', authorize('admin'), batchController.addSubjectToSemester);

module.exports = router;