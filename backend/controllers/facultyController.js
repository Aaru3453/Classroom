import Faculty from "../models/Faculty.js";

// GET all faculty
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ status: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE faculty
export const createFaculty = async (req, res) => {
  try {
    if (typeof req.body.subjects === "string") {
      req.body.subjects = req.body.subjects
        .split(",")
        .map((s) => s.trim());
    }

    const faculty = await Faculty.create(req.body);

    res.status(201).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE faculty
export const updateFaculty = async (req, res) => {
  try {
    if (typeof req.body.subjects === "string") {
      req.body.subjects = req.body.subjects
        .split(",")
        .map((s) => s.trim());
    }

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE faculty (soft delete)
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
