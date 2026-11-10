const pool = require("../config/db");

async function createUser({ email, passwordHash }) {
  const [result] = await pool.execute(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)",
    [email, passwordHash]
  );

  return findById(result.insertId)

}

async function findByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute(
    "SELECT id, email, status, created_at, last_login_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
}

async function updateLastLogin(id){
  await pool.execute(
    "UPDATE users SET last_login_at = NOW() WHERE id = ?",
    [id]
  );
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateLastLogin
};
