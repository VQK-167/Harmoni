// TODO (PRO-01) createProfile(req, res) — validate đủ field bắt buộc + SAF-04 (birthDate phải đủ 18 tuổi), tạo profile + lưu interestIds (INT-02) qua userInterestModel
// TODO (PRO-02) getMyProfile(req, res) — lấy profile + interestIds của chính mình
// TODO (PRO-03) updateProfile(req, res) — cập nhật các field hồ sơ, cũng check SAF-04 nếu đổi birthDate
// TODO (INT-03) updateInterests(req, res) — cập nhật danh sách sở thích

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  createProfile: notImplemented,
  getMyProfile: notImplemented,
  updateProfile: notImplemented,
  updateInterests: notImplemented,
};
