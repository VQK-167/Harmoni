// TODO (SAF-03) reportUser(req, res) — nhận { targetUserId, reason, detail }, chặn báo cáo trùng khi đã có report PENDING với cùng người

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  reportUser: notImplemented,
};
