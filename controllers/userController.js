import bcrypt from "bcryptjs";
import { createfield, finduserbyemail } from "../models/userModel.js";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const userRegister = async (req, res) => {
  try {
    const {
      name: fullName = "",
      email = "",
      password = "",
    } = req.body;

    // Clean user input
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate required fields
    if (!cleanName || !cleanEmail || !password) {
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
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Check if email already exists
    const existingUser = await finduserbyemail(cleanEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await createfield(cleanName, cleanEmail, hashedPassword);

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

    // Clean user input
    const cleanEmail = email.trim().toLowerCase();

    // Validate required fields
    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    // Find user
    const user = await finduserbyemail(cleanEmail);

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