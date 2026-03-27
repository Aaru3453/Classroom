
import express from "express";
import userController from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();


router.use(protect);

// =============== PROFILE ROUTES (All users) ===============
router.get("/profile", userController.getProfile); // Get current user profile
router.put("/profile", userController.updateProfile); // Update current user profile
router.put("/change-password", userController.changePassword); // Change password
router.put("/preferences", userController.updatePreferences); // Update preferences

// =============== ADMIN ROUTES (Admin only) ===============
router.get("/", authorize("admin"), userController.getUsers); // Get all users
router.get("/:id", authorize("admin"), userController.getUser); // Get user by ID
router.post("/", authorize("admin"), userController.createUser); // Create new user
router.put("/:id", authorize("admin"), userController.updateUser); // Update user
router.delete("/:id", authorize("admin"), userController.deleteUser); // Delete user (soft delete)

// =============== ADMIN MANAGEMENT ROUTES ===============
router.get("/stats", authorize("admin"), userController.getUserStats); // Get user statistics
router.put("/:id/reset-password", authorize("admin"), userController.resetPassword); // Reset user password
router.post("/bulk", authorize("admin"), userController.bulkCreateUsers); // Bulk create users
router.put("/bulk-deactivate", authorize("admin"), userController.bulkDeactivateUsers); // Bulk deactivate users
router.get("/search", authorize("admin"), userController.searchUsers); // Search users

export default router;