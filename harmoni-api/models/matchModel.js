const pool = require("../config/db");

// Tao match giua hai user.
async function create({ user1Id, user2Id }) {
  // Sap xep ID de (2, 3) va (3, 2) luon la cung mot cap.
  const firstUserId = Math.min(user1Id, user2Id);
  const secondUserId = Math.max(user1Id, user2Id);

  const SQL = `
    INSERT INTO matches (user1_id, user2_id)
    VALUES (?, ?)
  `;

  const [result] = await pool.execute(SQL, [
    firstUserId,
    secondUserId
  ]);

  return findById(result.insertId);
}

// Tim match giua hai user, khong phan biet thu tu ID.
async function findByPair(userAId, userBId) {
  const firstUserId = Math.min(userAId, userBId);
  const secondUserId = Math.max(userAId, userBId);

  const SQL = `
    SELECT *
    FROM matches
    WHERE user1_id = ? AND user2_id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(SQL, [
    firstUserId,
    secondUserId
  ]);

  return rows[0] || null;
}

// Lay cac match dang ACTIVE cua mot user.
async function findActiveByUserId(userId) {
  const SQL = `
    SELECT *
    FROM matches
    WHERE (user1_id = ? OR user2_id = ?)
      AND status = 'ACTIVE'
    ORDER BY matched_at DESC
  `;

  const [rows] = await pool.execute(SQL, [userId, userId]);

  return rows;
}

// Tim match theo ID.
async function findById(matchId) {
  const SQL = `
    SELECT *
    FROM matches
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(SQL, [matchId]);

  return rows[0] || null;
}

// Huy match bang cach doi trang thai, khong xoa ban ghi.
async function setUnmatched(matchId) {
  const SQL = `
    UPDATE matches
    SET status = 'UNMATCHED', unmatched_at = NOW()
    WHERE id = ?
  `;

  await pool.execute(SQL, [matchId]);
}

// Kich hoat lai match cu khi hai user LIKE lai nhau.
async function setActive(matchId) {
  const SQL = `
    UPDATE matches
    SET status = 'ACTIVE', unmatched_at = NULL
    WHERE id = ?
  `;

  await pool.execute(SQL, [matchId]);
}

module.exports = {
  create,
  findByPair,
  findActiveByUserId,
  findById,
  setUnmatched,
  setActive
};
