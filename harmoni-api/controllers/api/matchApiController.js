// TODO (MAT-03) getMatches(req, res) — danh sách match ACTIVE của mình + thông tin người kia + tin nhắn cuối (MSG-01)
// TODO (MAT-04) unmatch(req, res) — kiểm tra mình có thuộc match này không, đổi status sang UNMATCHED

// --- Tin nhắn lồng trong match (MSG-01..04) ---
// TODO (MSG-03) getMessages(req, res) — lấy tin nhắn theo matchId, hỗ trợ query afterId cho MSG-04 (làm mới)
// TODO (MSG-02) sendMessage(req, res) — kiểm tra match còn ACTIVE mới cho gửi, validate nội dung không trống/không quá dài

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  getMatches: notImplemented,
  unmatch: notImplemented,
  getMessages: notImplemented,
  sendMessage: notImplemented,
};
