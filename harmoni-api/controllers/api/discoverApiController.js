// TODO (DIS-01) getDiscoverList(req, res):
//   - lấy toàn bộ profile khác mình, loại người đã Like/Pass rồi (LIKE-03), loại người bị chặn 2 chiều (SAF-01)
//   - (DIS-03, DIS-04) với mỗi người: tính sở thích chung + % tương đồng so với sở thích của mình
//   - (DIS-05) sắp xếp giảm dần theo % tương đồng
// TODO (DIS-02) getUserDetail(req, res) — chi tiết 1 hồ sơ + % tương đồng + trạng thái đã Like/Pass/Block chưa

function notImplemented(req, res) {
  res.status(501).json({ success: false, message: "Chưa triển khai", data: null });
}

module.exports = {
  getDiscoverList: notImplemented,
  getUserDetail: notImplemented,
};
