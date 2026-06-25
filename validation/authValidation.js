import { z } from "zod";
import { validate } from "../middleware/validate.js";

// Register validation schema
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must not exceed 50 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format")
      .max(100, "Email must not exceed 100 characters"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must not exceed 100 characters"),
    role: z
      .string()
      .trim()
      .optional(),
  }),
});

// Login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  }),
});

export const registerValidation = validate(registerSchema);
export const loginValidation = validate(loginSchema);
