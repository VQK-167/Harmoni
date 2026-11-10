const pool = require("../config/db");

// Luu hanh dong like or pass
async function upsert({ senderId, receiverId, action }) {
  const SQL = `
    INSERT INTO likes (sender_id, receiver_id, action)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE action = VALUES(action)
  `;
  await pool.execute(SQL, [senderId, receiverId, action]);
}

// Kiem tra hanh dong like or pass
async function findBySenderAndReceiver(senderId, receiverId) {
  const SQL = `
    SELECT *
    FROM likes
    WHERE sender_id = ? AND receiver_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(SQL, [senderId, receiverId]);
  return rows[0] || null;
}

// Lay id cua ng khac duoc senderId like or pass
async function findLikedReceiverIds(senderId) {
  const SQL = `
    SELECT receiver_id
    FROM likes
    WHERE sender_id = ?
  `;
  const [rows] = await pool.execute(SQL, [senderId]);
  return rows.map((row) => row.receiver_id);
}

module.exports = {
  upsert,
  findBySenderAndReceiver,
  findLikedReceiverIds,
};
