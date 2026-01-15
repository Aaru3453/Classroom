const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authorize('admin'), userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', userController.getUser);

// @route   POST /api/users
// @desc    Create user
// @access  Private (Admin only)
router.post('/', authorize('admin'), userController.createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', authorize('admin'), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), userController.deleteUser);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', userController.updateProfile);

// @route   PUT /api/users/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', userController.changePassword);

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', userController.updatePreferences);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats', authorize('admin'), userController.getUserStats);

// @route   PUT /api/users/:id/reset-password
// @desc    Reset user password
// @access  Private (Admin only)
router.put('/:id/reset-password', authorize('admin'), userController.resetPassword);

// @route   POST /api/users/bulk
// @desc    Bulk create users
// @access  Private (Admin only)
router.post('/bulk', authorize('admin'), userController.bulkCreateUsers);

// @route   PUT /api/users/bulk-deactivate
// @desc    Deactivate multiple users
// @access  Private (Admin only)
router.put('/bulk-deactivate', authorize('admin'), userController.bulkDeactivateUsers);

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', userController.searchUsers);

module.exports = router;