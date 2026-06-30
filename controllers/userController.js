import bcrypt from "bcryptjs";
import { createfield, finduserbyemail } from "../models/userModel.js";




export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation//
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "please fill all the details"
      })
    }

    // password strength validation //
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      });
    }

    // check user already exist/
    const existingUser = await finduserbyemail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // password hashing//

    const hash = await bcrypt.hash(password, 10);
    const safepass = await createfield(name, email, hash);
    res.status(201).json({
      success: true,
      message: "User registered successfully"
    })







  } catch (error) {
    console.error("Error in userRegister:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}