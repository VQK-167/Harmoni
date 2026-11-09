// Import connection pool de gui cau lenh SQL den MySQL.
const pool = require("../config/db");

// Luu hanh dong LIKE hoac PASS cua mot user danh cho user khac.
// Neu cap sender_id + receiver_id da ton tai thi cap nhat action,
// tranh tao nhieu dong trung cho cung mot cap nguoi dung.
async function upsert({ senderId, receiverId, action }) {
  const SQL = `
    INSERT INTO likes (sender_id, receiver_id, action)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE action = VALUES(action)
  `;

  // Ba dau ? lan luot nhan senderId, receiverId va action.
  // await cho database xu ly xong roi moi chay tiep.
  await pool.execute(SQL, [senderId, receiverId, action]);
}

// Tim hanh dong cua sender doi voi receiver.
// Dung de biet mot user da LIKE hoac PASS nguoi kia chua.
async function findBySenderAndReceiver(senderId, receiverId) {
  const SQL = `
    SELECT *
    FROM likes
    WHERE sender_id = ? AND receiver_id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(SQL, [senderId, receiverId]);

  // Co du lieu thi tra ve dong dau tien; khong co thi tra ve null.
  return rows[0] || null;
}

// Lay danh sach ID nhung nguoi ma sender da LIKE hoac PASS.
// Discovery dung danh sach nay de khong hien thi lai ho.
async function findLikedReceiverIds(senderId) {
  const SQL = `
    SELECT receiver_id
    FROM likes
    WHERE sender_id = ?
  `;

  const [rows] = await pool.execute(SQL, [senderId]);

  // Tu [{ receiver_id: 3 }, { receiver_id: 5 }]
  // chuyen thanh [3, 5] de controller de su dung.
  return rows.map((row) => row.receiver_id);
}

// Cho phep controller su dung cac ham cua model nay.
module.exports = {
  upsert,
  findBySenderAndReceiver,
  findLikedReceiverIds
};
