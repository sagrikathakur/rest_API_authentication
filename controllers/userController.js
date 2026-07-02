import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { createfield, finduserbyemail } from "../models/userModel.js";

export const userRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if email already exists
    const existingUser = await finduserbyemail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    await createfield(fullName, email, hashedPassword);

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
    const { email, password } = req.body;

    // Find user
    const user = await finduserbyemail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isPasswordMatch = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT access token
    const accessToken = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
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