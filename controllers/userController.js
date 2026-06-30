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

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details"
      });
    }

    // check user exists
    const user = await finduserbyemail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        registeredDate: user.created_at
      }
    });

  } catch (error) {
    console.error("Error in userLogin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}