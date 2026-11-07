const pool = require("../config/db");

async function createUser({ email, passwordHash }) {
  const sql = `
    INSERT INTO users (email, password_hash)
    VALUES (?, ?)
  `;

  const [result] = await pool.execute(sql, [
    email,
    passwordHash
  ]);

  return findById(result.insertId);
}

async function findByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(sql, [email]);

  return rows[0] || null;
}

async function findById(id) {
  const sql = `
    SELECT id, email, status, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(sql, [id]);

  return rows[0] || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById
};
