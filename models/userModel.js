import pool from "../config/db.js";




// find user by email//
export const finduserbyemail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM createProfile WHERE email=$1`,
    [email]
  )
  return result.rows[0]
}


// create user registration table//

export const createfield = async (name, email, password) => {
  const result = await pool.query(
    `INSERT INTO createProfile (name, email, password)
    VALUES($1 , $2 , $3)
    RETURNING id , email , created_at AS "registeredDate"
    `,
    [name, email, password]
  )
  return result.rows[0]
}
