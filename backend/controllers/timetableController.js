import Timetable from "../models/Timetable.js";

// ================= GET ALL TIMETABLES =================
export const getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find();
    res.status(200).json({
      success: true,
      data: timetables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CREATE TIMETABLE =================
export const createTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE TIMETABLE =================
export const updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE TIMETABLE =================
export const deleteTimetable = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Timetable deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
