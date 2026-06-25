import express from "express";
import { register, login } from "../controller/authController.js";
import { registerValidation, loginValidation } from "../validation/authValidation.js";

const router = express.Router();

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router;
