const Timetable = require('../models/Timetable');

// @desc    Get all timetables
// @route   GET /api/timetables
// @access  Private
exports.getTimetables = async (req, res, next) => {
  try {
    const { department, status, search } = req.query;
    
    let query = {};
    
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    
    if (status && status !== 'All Statuses') {
      query.status = status;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const timetables = await Timetable.find(query)
      .populate('generatedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('schedule.subject', 'name code')
      .populate('schedule.faculty', 'user designation')
      .populate('schedule.faculty.user', 'name')
      .populate('schedule.classroom', 'code name')
      .populate('schedule.batch', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single timetable
// @route   GET /api/timetables/:id
// @access  Private
exports.getTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('generatedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('schedule.subject', 'name code credits')
      .populate('schedule.faculty', 'user designation')
      .populate('schedule.faculty.user', 'name email')
      .populate('schedule.classroom', 'code name capacity building')
      .populate('schedule.batch', 'name code');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create timetable
// @route   POST /api/timetables
// @access  Private
exports.createTimetable = async (req, res, next) => {
  try {
    req.body.generatedBy = req.user.id;
    
    const timetable = await Timetable.create(req.body);

    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('generatedBy', 'name email')
      .populate('schedule.subject', 'name code')
      .populate('schedule.faculty', 'user designation')
      .populate('schedule.faculty.user', 'name')
      .populate('schedule.classroom', 'code name')
      .populate('schedule.batch', 'name code');

    res.status(201).json({
      success: true,
      data: populatedTimetable
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update timetable
// @route   PUT /api/timetables/:id
// @access  Private
exports.updateTimetable = async (req, res, next) => {
  try {
    let timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .populate('generatedBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('schedule.subject', 'name code')
    .populate('schedule.faculty', 'user designation')
    .populate('schedule.faculty.user', 'name')
    .populate('schedule.classroom', 'code name')
    .populate('schedule.batch', 'name code');

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete timetable
// @route   DELETE /api/timetables/:id
// @access  Private
exports.deleteTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    await Timetable.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve timetable
// @route   PUT /api/timetables/:id/approve
// @access  Private
exports.approveTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    timetable.status = 'Approved';
    timetable.approvedBy = req.user.id;
    timetable.approvalDate = new Date();

    await timetable.save();

    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('generatedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('schedule.subject', 'name code')
      .populate('schedule.faculty', 'user designation')
      .populate('schedule.faculty.user', 'name')
      .populate('schedule.classroom', 'code name')
      .populate('schedule.batch', 'name code');

    res.status(200).json({
      success: true,
      data: populatedTimetable
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate timetable automatically
// @route   POST /api/timetables/generate
// @access  Private
exports.generateTimetable = async (req, res, next) => {
  try {
    const { department, academicYear, semester, batches, preferences } = req.body;

    // This would integrate with your timetable generation algorithm
    // For now, returning a mock response
    const generatedSchedule = await generateAutomaticTimetable({
      department,
      academicYear,
      semester,
      batches,
      preferences
    });

    const timetable = await Timetable.create({
      title: `${department} - ${academicYear} - Semester ${semester}`,
      department,
      academicYear,
      semester,
      schedule: generatedSchedule,
      generatedBy: req.user.id,
      status: 'Draft',
      notes: 'Automatically generated timetable'
    });

    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('generatedBy', 'name email')
      .populate('schedule.subject', 'name code')
      .populate('schedule.faculty', 'user designation')
      .populate('schedule.faculty.user', 'name')
      .populate('schedule.classroom', 'code name')
      .populate('schedule.batch', 'name code');

    res.status(201).json({
      success: true,
      data: populatedTimetable
    });
  } catch (error) {
    next(error);
  }
};

// Helper function for timetable generation
async function generateAutomaticTimetable(params) {
  // This is a simplified version - you would implement your actual algorithm here
  const { department, academicYear, semester, batches, preferences } = params;
  
  // Mock generated schedule
  return [
    {
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'subject_id_1',
      faculty: 'faculty_id_1',
      classroom: 'classroom_id_1',
      batch: batches[0]
    }
    // ... more schedule slots
  ];
}