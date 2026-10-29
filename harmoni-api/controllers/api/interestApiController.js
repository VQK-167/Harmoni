// TODO (INT-01) getInterests(req, res) — trả toàn bộ danh mục sở thích

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  getInterests: notImplemented,
};
