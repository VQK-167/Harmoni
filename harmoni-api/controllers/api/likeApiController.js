// TODO (LIKE-01, LIKE-02, LIKE-03) sendLike(req, res):
//   - nhận { receiverId, action: 'LIKE' | 'PASS' }, upsert vào likeModel (không tạo trùng dòng)
//   - (MAT-01) nếu action === 'LIKE' và receiver cũng đã LIKE mình trước đó -> tạo Match mới (hoặc kích hoạt lại nếu đã UNMATCHED)
//   - trả về { matched: boolean, matchId } để frontend hiển thị thông báo Match (MAT-02)

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  sendLike: notImplemented,
};
