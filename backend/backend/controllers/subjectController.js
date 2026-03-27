import Subject from "../models/Subject.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSubject = async (req, res) => {
  try {
    // ✅ Status को हमेशा true set करें
    const subjectData = {
      ...req.body,
      status: true // हमेशा true
    };
    
    const subject = await Subject.create(subjectData);
    res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    // ✅ Update data से status निकालें (हमेशा true रहेगा)
    const { status, ...updateData } = req.body;
    
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      updateData, // status update नहीं करेंगे
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Subject deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};