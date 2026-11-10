const pool = require("../config/db");

const REASONS = [
  "HARASSMENT",
  "FAKE_PROFILE",
  "INAPPROPRIATE_CONTENT",
  "SPAM",
  "OTHER",
];

//tao bao cao moi
async function create({ reporterId, reportedId, reason, description }) {
  // Khong truyen cot status: bang da co DEFAULT 'PENDING'
  const [result] = await pool.execute(
    `INSERT INTO reports (reporter_id, reported_id, reason, description)
     VALUES (?, ?, ?, ?)`,
    [
      Number(reporterId),
      Number(reportedId),
      reason,
      description ? String(description).trim() : null,
    ]
  );

  return result.insertId;
}

//tim bao cao con dang cho xu ly giua hai nguoi, de chan bao cao trung
async function findPending(reporterId, reportedId) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM reports
     WHERE reporter_id = ?
       AND reported_id = ?
       AND status = 'PENDING'
     LIMIT 1`,
    [Number(reporterId), Number(reportedId)]
  );

  return rows[0] || null;
}

module.exports = {
  REASONS,
  create,
  findPending,
};
