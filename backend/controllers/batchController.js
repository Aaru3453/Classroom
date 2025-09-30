const Batch = require('../models/Batch');

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
exports.getBatches = async (req, res, next) => {
  try {
    const { department, search } = req.query;
    
    let query = { isActive: true };
    
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const batches = await Batch.find(query)
      .populate('classTeacher', 'user designation')
      .populate('classTeacher.user', 'name email')
      .sort({ academicYear: -1, code: 1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Private
exports.getBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('classTeacher', 'user designation')
      .populate('classTeacher.user', 'name email')
      .populate('semesters.subjects.subject', 'name code credits type')
      .populate('semesters.subjects.faculty', 'user designation')
      .populate('semesters.subjects.faculty.user', 'name email');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create batch
// @route   POST /api/batches
// @access  Private
exports.createBatch = async (req, res, next) => {
  try {
    const batch = await Batch.create(req.body);

    const populatedBatch = await Batch.findById(batch._id)
      .populate('classTeacher', 'user designation')
      .populate('classTeacher.user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedBatch
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private
exports.updateBatch = async (req, res, next) => {
  try {
    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('classTeacher', 'user designation')
      .populate('classTeacher.user', 'name email');

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private
exports.deleteBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    batch.isActive = false;
    await batch.save();

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subject to batch semester
// @route   PUT /api/batches/:id/semesters/:semesterId/subjects
// @access  Private
exports.addSubjectToSemester = async (req, res, next) => {
  try {
    const { subjectId, facultyId } = req.body;
    
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    const semester = batch.semesters.id(req.params.semesterId);
    
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    semester.subjects.push({
      subject: subjectId,
      faculty: facultyId
    });

    await batch.save();

    const updatedBatch = await Batch.findById(batch._id)
      .populate('semesters.subjects.subject', 'name code credits type')
      .populate('semesters.subjects.faculty', 'user designation')
      .populate('semesters.subjects.faculty.user', 'name email');

    res.status(200).json({
      success: true,
      data: updatedBatch
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (you can use JWT or crypto)
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET + user.password, 
      { expiresIn: '15m' }
    );

    // In a real application, you would:
    // 1. Save resetToken to user document
    // 2. Send email with reset link
    // 3. Handle token expiration

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: http://localhost:3000/reset-password/${resetToken}`);

    // For now, return success response
    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email',
      // In production, don't send token in response
      resetToken: resetToken // Remove this in production
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};