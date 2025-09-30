const User = require('../models/User');
const Faculty = require('../models/Faculty');
const emailService = require('../services/emailService');
const { generateRandomPassword } = require('../utils/helpers');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { role, department, search, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by role
    if (role && role !== 'All Roles') {
      query.role = role;
    }
    
    // Filter by department
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    let user;
    
    // If ID is provided, get that user (admin only)
    if (req.params.id) {
      user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } else {
      // Get current user (from profile route)
      user = await User.findById(req.user.id).select('-password');
    }

    // If user is faculty, populate faculty details
    if (user.role === 'faculty') {
      const facultyProfile = await Faculty.findOne({ user: user._id })
        .populate('subjects', 'name code');
      
      user = user.toObject();
      user.facultyProfile = facultyProfile;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, department, sendWelcomeEmail = true, ...otherData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate random password if not provided
    let password = req.body.password;
    if (!password) {
      password = generateRandomPassword();
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      ...otherData
    });

    // If faculty, create faculty profile
    if (role === 'faculty') {
      await Faculty.create({
        user: user._id,
        employeeId: `FAC${Date.now()}`,
        department,
        designation: otherData.designation || 'Professor',
        officeLocation: otherData.officeLocation,
        contact: otherData.contact
      });
    }

    // Send welcome email if requested
    if (sendWelcomeEmail) {
      try {
        await emailService.sendWelcomeEmail(user, password);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue even if email fails
      }
    }

    // Get populated user data
    const userResponse = await User.findById(user._id).select('-password');
    let responseData = userResponse.toObject();

    if (role === 'faculty') {
      const facultyProfile = await Faculty.findOne({ user: user._id });
      responseData.facultyProfile = facultyProfile;
    }

    res.status(201).json({
      success: true,
      data: responseData,
      message: sendWelcomeEmail ? 'User created successfully. Welcome email sent.' : 'User created successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating password through this route
    if (req.body.password) {
      delete req.body.password;
    }

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    // If faculty and department/designation changed, update faculty profile
    if (user.role === 'faculty' && (req.body.department || req.body.designation)) {
      await Faculty.findOneAndUpdate(
        { user: user._id },
        {
          department: req.body.department || user.department,
          designation: req.body.designation
        },
        { new: true }
      );
    }

    let responseData = user.toObject();

    if (user.role === 'faculty') {
      const facultyProfile = await Faculty.findOne({ user: user._id })
        .populate('subjects', 'name code');
      responseData.facultyProfile = facultyProfile;
    }

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    // If faculty, also deactivate faculty profile
    if (user.role === 'faculty') {
      await Faculty.findOneAndUpdate(
        { user: user._id },
        { isActive: false }
      );
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      department: req.body.department
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    // If faculty, update faculty profile if needed
    if (user.role === 'faculty' && req.body.department) {
      await Faculty.findOneAndUpdate(
        { user: user._id },
        { department: req.body.department }
      );
    }

    let responseData = user.toObject();

    if (user.role === 'faculty') {
      const facultyProfile = await Faculty.findOne({ user: user._id })
        .populate('subjects', 'name code');
      responseData.facultyProfile = facultyProfile;
    }

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
  try {
    const { notifications, theme, language } = req.body;

    const updateFields = {};
    
    if (notifications) {
      updateFields['preferences.notifications'] = notifications;
    }
    
    if (theme) {
      updateFields['preferences.theme'] = theme;
    }
    
    if (language) {
      updateFields['preferences.language'] = language;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old avatar from Cloudinary if exists
    if (user.avatar && user.avatar.public_id) {
      // This would require Cloudinary SDK integration
      // await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Update user with new avatar
    user.avatar = {
      public_id: req.file.filename,
      url: req.file.path
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: user.avatar,
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const usersByDepartment = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentRegistrations = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersByRole,
        usersByDepartment,
        recentRegistrations,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password (admin function)
// @route   PUT /api/users/:id/reset-password
// @access  Private/Admin
exports.resetPassword = async (req, res, next) => {
  try {
    const { sendEmail = true } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();
    
    // Update password
    user.password = newPassword;
    await user.save();

    // Send email with new password
    if (sendEmail) {
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: 'Password Reset - EduScheduler',
          html: `
            <h2>Password Reset</h2>
            <p>Your password has been reset by an administrator.</p>
            <p><strong>New Password:</strong> ${newPassword}</p>
            <p>Please login and change your password immediately.</p>
            <p><a href="${process.env.CLIENT_URL}/login">Login to EduScheduler</a></p>
            <hr>
            <p><small>This is an automated message from EduScheduler.</small></p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: sendEmail ? 
        'Password reset successfully. New password sent to user email.' : 
        'Password reset successfully.',
      data: sendEmail ? {} : { newPassword } // Only return password if not sent via email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create users (for admin)
// @route   POST /api/users/bulk
// @access  Private/Admin
exports.bulkCreateUsers = async (req, res, next) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of users'
      });
    }

    const results = {
      successful: [],
      failed: []
    };

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          results.failed.push({
            email: userData.email,
            error: 'User already exists'
          });
          continue;
        }

        // Generate password if not provided
        const password = userData.password || generateRandomPassword();

        // Create user
        const user = await User.create({
          name: userData.name,
          email: userData.email,
          password,
          role: userData.role || 'faculty',
          department: userData.department
        });

        // Create faculty profile if applicable
        if (user.role === 'faculty') {
          await Faculty.create({
            user: user._id,
            employeeId: `FAC${Date.now()}`,
            department: userData.department,
            designation: userData.designation || 'Professor'
          });
        }

        // Send welcome email
        try {
          await emailService.sendWelcomeEmail(user, password);
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${user.email}:`, emailError);
        }

        results.successful.push({
          email: user.email,
          userId: user._id
        });

      } catch (error) {
        results.failed.push({
          email: userData.email,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: `Bulk user creation completed. Successful: ${results.successful.length}, Failed: ${results.failed.length}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate multiple users
// @route   PUT /api/users/bulk-deactivate
// @access  Private/Admin
exports.bulkDeactivateUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of user IDs'
      });
    }

    // Deactivate users
    await User.updateMany(
      { _id: { $in: userIds } },
      { isActive: false }
    );

    // Deactivate corresponding faculty profiles
    await Faculty.updateMany(
      { user: { $in: userIds } },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: `${userIds.length} users deactivated successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res, next) => {
  try {
    const { query, role, department, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let searchQuery = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    if (role && role !== 'All Roles') {
      searchQuery.role = role;
    }

    if (department && department !== 'All Departments') {
      searchQuery.department = department;
    }

    const users = await User.find(searchQuery)
      .select('name email role department avatar')
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};