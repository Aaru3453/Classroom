// backend/routes/suggestionRoutes.js
import express from "express";
import Suggestion from "../models/Suggestion.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { name, email, category, priority, suggestion, isAnonymous } = req.body;

    // Validate required fields
    if (!name || !email || !suggestion) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and suggestion",
      });
    }

    // Create suggestion
    const newSuggestion = await Suggestion.create({
      name: isAnonymous ? "Anonymous" : name,
      email: isAnonymous ? "anonymous@eduscheduler.com" : email,
      category,
      priority,
      suggestion,
      isAnonymous: isAnonymous || false,
      userId: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully",
      suggestion: {
        id: newSuggestion._id,
        name: newSuggestion.name,
        category: newSuggestion.category,
        priority: newSuggestion.priority,
        status: newSuggestion.status,
        createdAt: newSuggestion.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting suggestion:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit suggestion",
    });
  }
});

// @desc    Get all suggestions (with filters)
// @route   GET /api/suggestions
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, status, priority, sort = "latest", page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (status && status !== "All") filter.status = status;
    if (priority && priority !== "All") filter.priority = priority;

    // Build sort
    let sortOption = {};
    switch (sort) {
      case "latest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "most-upvoted":
        sortOption = { upvotes: -1 };
        break;
      case "most-discussed":
        sortOption = { comments: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Suggestion.countDocuments(filter);

    // Fetch suggestions
    const suggestions = await Suggestion.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "name email")
      .lean();

    // Get stats
    const stats = {
      total: await Suggestion.countDocuments(),
      pending: await Suggestion.countDocuments({ status: "Pending" }),
      underReview: await Suggestion.countDocuments({ status: "Under Review" }),
      implemented: await Suggestion.countDocuments({ status: "Implemented" }),
    };

    res.json({
      success: true,
      suggestions,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch suggestions",
    });
  }
});

// @desc    Get single suggestion by ID
// @route   GET /api/suggestions/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id)
      .populate("userId", "name email")
      .lean();

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
    }

    res.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch suggestion",
    });
  }
});

// @desc    Upvote a suggestion
// @route   POST /api/suggestions/:id/upvote
// @access  Private
router.post("/:id/upvote", protect, async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
    }

    // Check if user already upvoted
    const hasUpvoted = suggestion.upvotedBy.includes(req.user._id);

    if (hasUpvoted) {
      // Remove upvote
      suggestion.upvotes -= 1;
      suggestion.upvotedBy = suggestion.upvotedBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote
      suggestion.upvotes += 1;
      suggestion.upvotedBy.push(req.user._id);
    }

    await suggestion.save();

    res.json({
      success: true,
      upvotes: suggestion.upvotes,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    console.error("Error upvoting suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upvote suggestion",
    });
  }
});

// @desc    Update suggestion status (Admin only)
// @route   PUT /api/suggestions/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    // Check if user is admin (you'll need to add role to user model)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
    }

    suggestion.status = status || suggestion.status;
    if (adminResponse) suggestion.adminResponse = adminResponse;
    if (status === "Implemented") suggestion.implementedDate = new Date();

    await suggestion.save();

    res.json({
      success: true,
      message: "Suggestion updated successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Error updating suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update suggestion",
    });
  }
});

// @desc    Get suggestion statistics
// @route   GET /api/suggestions/stats/overview
// @access  Public
router.get("/stats/overview", async (req, res) => {
  try {
    const [
      total,
      pending,
      underReview,
      implemented,
      featureRequests,
      bugReports,
    ] = await Promise.all([
      Suggestion.countDocuments(),
      Suggestion.countDocuments({ status: "Pending" }),
      Suggestion.countDocuments({ status: "Under Review" }),
      Suggestion.countDocuments({ status: "Implemented" }),
      Suggestion.countDocuments({ category: "Feature Request" }),
      Suggestion.countDocuments({ category: "Bug Report" }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        underReview,
        implemented,
        featureRequests,
        bugReports,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

export default router;