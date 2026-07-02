import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Generate a JWT access token for a user containing only id and role
 * @param {number|string} id - User ID
 * @param {string} role - User role
 * @returns {string} Signed JWT token
 */
export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    }
  );
};

/**
 * Hash a password using bcrypt
 * @param {string} password 
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain password against hashed password
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>} Match result
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
