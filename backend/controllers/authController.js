import User from "../models/User.js";
import Faculty from "../models/Faculty.js";
import validator from "validator";

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
    });

    if (role === "faculty") {
      await Faculty.create({
        user: user._id,
        employeeId: `FAC${Date.now()}`,
        department,
        designation: "Professor",
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ME =================
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email required",
    });
  }

  res.status(200).json({
    success: true,
    message: "If account exists, reset link sent",
  });
};
