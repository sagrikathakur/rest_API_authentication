import bcrypt from "bcryptjs";
import { createfield } from "../models/userModel.js";




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