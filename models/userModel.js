import { pool } from "../config/db.js";

/**
 * Creates a new user in the userAuth table
 * @param {Object} userData - User details
 * @returns {Promise<Object>} The inserted user record (excluding password)
 */
export const createUser = async (userData) => {
  const { name, email, password, role = 'user' } = userData;
  const result = await pool.query(
    `INSERT INTO userAuth (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role]
  );
  return result.rows[0];
};

/**
 * Finds a user by email
 * @param {string} email - User email address
 * @returns {Promise<Object|null>} The user record or null if not found
 */
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM userAuth WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Finds a user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} The user record (excluding password) or null if not found
 */
export const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM userAuth WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};
