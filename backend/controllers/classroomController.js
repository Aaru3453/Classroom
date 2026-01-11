const Classroom = require('../models/Classroom');

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private
exports.getClassrooms = async (req, res, next) => {
  try {
    const { department, type, status, search } = req.query;
    
    let query = {};
    
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    
    if (type && type !== 'All Room Types') {
      query.type = type;
    }
    
    if (status && status !== 'All Statuses') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { building: { $regex: search, $options: 'i' } }
      ];
    }

    const classrooms = await Classroom.find(query).sort({ code: 1 });

    res.status(200).json({
      success: true,
      count: classrooms.length,
      data: classrooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single classroom
// @route   GET /api/classrooms/:id
// @access  Private
exports.getClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classroom
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create classroom
// @route   POST /api/classrooms
// @access  Private
exports.createClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.create(req.body);

    res.status(201).json({
      success: true,
      data: classroom
    });
  } catch (error) {
    next(error);
  }
};

exports.updateClassroom = async (req, res, next) => {
  try {
    let classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: classroom
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    await Classroom.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Classroom deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassroomUtilization = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        current: classroom.utilization.current,
        history: classroom.utilization.history
      }
    });
  } catch (error) {
    next(error);
  }
};