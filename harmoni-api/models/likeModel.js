// Bảng likes — LIKE-01, LIKE-02, LIKE-03
// TODO: upsert({ senderId, receiverId, action }) — nếu đã có dòng (sender, receiver) thì update action, chưa có thì insert
// TODO: findBySenderAndReceiver(senderId, receiverId) — dùng để check Match (MAT-01): xem receiver đã LIKE sender chưa
// TODO: findLikedReceiverIds(senderId) — để loại khỏi danh sách Discover (DIS-01)
