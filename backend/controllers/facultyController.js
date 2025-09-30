const Faculty = require('../models/Faculty');
const User = require('../models/User');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private
exports.getFaculty = async (req, res, next) => {
  try {
    const { department, search } = req.query;
    
    let query = { isActive: true };
    
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    
    if (search) {
      query.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const faculty = await Faculty.find(query)
      .populate('user', 'name email avatar')
      .populate('subjects', 'name code')
      .sort({ employeeId: 1 });

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Private
exports.getFacultyMember = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email avatar lastLogin')
      .populate('subjects', 'name code credits type');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create faculty
// @route   POST /api/faculty
// @access  Private
exports.createFaculty = async (req, res, next) => {
  try {
    // First create user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password || 'password123',
      role: 'faculty',
      department: req.body.department
    });

    // Then create faculty profile
    const faculty = await Faculty.create({
      user: user._id,
      employeeId: req.body.employeeId,
      department: req.body.department,
      designation: req.body.designation,
      qualifications: req.body.qualifications,
      officeHours: req.body.officeHours,
      officeLocation: req.body.officeLocation,
      contact: req.body.contact
    });

    const populatedFaculty = await Faculty.findById(faculty._id)
      .populate('user', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedFaculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private
exports.updateFaculty = async (req, res, next) => {
  try {
    let faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email avatar');

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private
exports.deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    // Soft delete by setting isActive to false
    faculty.isActive = false;
    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign subject to faculty
// @route   PUT /api/faculty/:id/subjects
// @access  Private
exports.assignSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.body;
    
    const faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    // Check if subject already assigned
    if (faculty.subjects.includes(subjectId)) {
      return res.status(400).json({
        success: false,
        message: 'Subject already assigned to this faculty member'
      });
    }

    faculty.subjects.push(subjectId);
    await faculty.save();

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};