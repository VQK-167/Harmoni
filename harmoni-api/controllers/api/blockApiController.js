// TODO (SAF-01) blockUser(req, res) — tạo block, đồng thời nếu đang có match ACTIVE với người này thì chuyển UNMATCHED
// TODO getBlocks(req, res) — danh sách người mình đã chặn
// TODO (SAF-02) unblockUser(req, res) — xoá block (không khôi phục match cũ)

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  blockUser: notImplemented,
  getBlocks: notImplemented,
  unblockUser: notImplemented,
};
