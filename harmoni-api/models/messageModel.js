const pool = require("../config/db");

// Tao tin nhan moi trong mot match.
async function create({ matchId, senderId, content }) {
  const SQL = `
    INSERT INTO messages (match_id, sender_id, content)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.execute(SQL, [
    matchId,
    senderId,
    content
  ]);

  return result.insertId;
}

// Lay tin nhan cua mot match.
// Neu co afterId thi chi lay tin nhan moi hon afterId.
async function findByMatchId(matchId, afterId) {
  if (afterId !== undefined && afterId !== null) {
    const SQL = `
      SELECT *
      FROM messages
      WHERE match_id = ? AND id > ?
      ORDER BY sent_at ASC
    `;

    const [rows] = await pool.execute(SQL, [matchId, afterId]);
    return rows;
  }

  const SQL = `
    SELECT *
    FROM messages
    WHERE match_id = ?
    ORDER BY sent_at ASC
  `;

  const [rows] = await pool.execute(SQL, [matchId]);
  return rows;
}

// Lay tin nhan moi nhat cua mot match.
async function findLastByMatchId(matchId) {
  const SQL = `
    SELECT *
    FROM messages
    WHERE match_id = ?
    ORDER BY sent_at DESC
    LIMIT 1
  `;

  const [rows] = await pool.execute(SQL, [matchId]);
  return rows[0] || null;
}

module.exports = {
  create,
  findByMatchId,
  findLastByMatchId
};
