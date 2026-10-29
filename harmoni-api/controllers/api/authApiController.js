// TODO (AUTH-01) register(req, res) — nhận email/password, validate, hash bằng bcrypt, lưu userModel, trả thông tin user (không trả password)
// TODO (AUTH-02) login(req, res) — tìm user theo email, so sánh bcrypt, nếu đúng thì set req.session.userId, trả user + hasProfile
// TODO (AUTH-03) logout(req, res) — req.session.destroy
// TODO me(req, res) — đọc req.session.userId, trả user hiện tại (hoặc null nếu chưa đăng nhập) — dùng khi F5 trang

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  register: notImplemented,
  login: notImplemented,
  logout: notImplemented,
  me: notImplemented,
};
