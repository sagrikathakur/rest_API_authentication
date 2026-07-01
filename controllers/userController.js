import bcrypt from "bcryptjs";
import { createfield, finduserbyemail } from "../models/userModel.js";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const userRegister = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      password = "",
    } = req.body;

    // Validate required fields
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    // Validate password strength
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, number, and special character.",
      });
    }

    // Check if user already exists
    const existingUser = await finduserbyemail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await createfield(name.trim(), email.trim(), hashedPassword);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error in userRegister:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const {
      email = "",
      password = "",
    } = req.body;

    // Validate required fields
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    // Find user
    const user = await finduserbyemail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in userLogin:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};