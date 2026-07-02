import express from "express";
import { userRegister, userLogin } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";

const router = express.Router();

// Public routes
router.post("/register", validateRequest(registerSchema), userRegister);
router.post("/login", validateRequest(loginSchema), userLogin);

// Protected routes (Requires access token in Authorization header)
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to your profile!",
    user: req.user,
  });
});

export default router;