const pool = require("../config/db");

//chan nguoi dung
async function create({ blockerId, blockedId }) {
  const [result] = await pool.execute(
    `INSERT IGNORE INTO blocks (blocker_id, blocked_id)
     VALUES (?, ?)`,
    [blockerId, blockedId]
  );

  // true = vua chan xong, false = da chan san tu truoc
  return result.affectedRows > 0;
}

//bo chan nguoi dung
async function remove(blockerId, blockedId) {
  const [result] = await pool.execute(
    `DELETE FROM blocks
     WHERE blocker_id = ? AND blocked_id = ?`,
    [blockerId, blockedId]
  );

  return result.affectedRows > 0;
}

//lay danh sach nguoi minh da chan
async function findByBlockerId(blockerId) {
  const [rows] = await pool.execute(
    `SELECT
        b.blocked_id AS userId,
        p.display_name AS displayName,
        p.avatar_url AS avatarUrl,
        b.created_at AS blockedAt
     FROM blocks b
     LEFT JOIN profiles p ON p.user_id = b.blocked_id
     WHERE b.blocker_id = ?
     ORDER BY b.created_at DESC`,
    [blockerId]
  );

  return rows;
}

//kiem tra chan 2 chieu khong
async function isBlockedEitherWay(userAId, userBId) {
  const a = Number(userAId);
  const b = Number(userBId);

  const [rows] = await pool.execute(
    `SELECT 1
     FROM blocks
     WHERE (blocker_id = ? AND blocked_id = ?)
        OR (blocker_id = ? AND blocked_id = ?)
     LIMIT 1`,
    [a, b, b, a]
  );

  return rows.length > 0;
}

async function findBlockedUserIds(userId) {
  const me = Number(userId);

  const [rows] = await pool.execute(
    `SELECT blocker_id, blocked_id
     FROM blocks
     WHERE blocker_id = ? OR blocked_id = ?`,
    [me, me]
  );

  const ids = new Set();

  for (const row of rows) {
    ids.add(
      row.blocker_id === me
        ? row.blocked_id
        : row.blocker_id
    );
  }

  return ids;
}

module.exports = {
  create,
  remove,
  findByBlockerId,
  isBlockedEitherWay,
  findBlockedUserIds
};
