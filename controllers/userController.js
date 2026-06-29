import bcrypt from "bcrypt";
import { createUser } from "../models/userModel.js"

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "all field are required"
      })
    }

    // for password hashing//


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(name, email, hashedPassword);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};








