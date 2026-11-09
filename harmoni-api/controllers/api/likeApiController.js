// Import model de controller co the luu va doc du lieu trong bang likes.
const likeModel = require("../../models/likeModel");

// Xu ly request khi user bam LIKE hoac PASS.
async function sendLike(req, res) {
  try {
    // Lay ID nguoi dang dang nhap tu session.
    // Khong lay senderId tu frontend de tranh gia mao nguoi gui.
    const senderId = req.session.userId;

    // Lay ID nguoi duoc thao tac va hanh dong tu request body.
    const { receiverId, action } = req.body;

    // Doi receiverId sang kieu so vi du lieu tu JSON co the la chuoi.
    const receiverIdNumber = Number(receiverId);

    // Kiem tra receiverId co phai la so nguyen duong khong.
    if (!Number.isInteger(receiverIdNumber) || receiverIdNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "receiverId khong hop le",
        data: null
      });
    }

    // Khong cho user tu LIKE hoac PASS chinh minh.
    if (receiverIdNumber === senderId) {
      return res.status(400).json({
        success: false,
        message: "Ban khong the Like hoac Pass chinh minh",
        data: null
      });
    }

    // Chi chap nhan dung hai hanh dong: LIKE hoac PASS.
    if (action !== "LIKE" && action !== "PASS") {
      return res.status(400).json({
        success: false,
        message: "action phai la LIKE hoac PASS",
        data: null
      });
    }

    // Goi model de INSERT hoac UPDATE hanh dong trong bang likes.
    await likeModel.upsert({
      senderId,
      receiverId: receiverIdNumber,
      action
    });

    // Hien tai moi luu LIKE/PASS.
    // matched van la false vi phan tao Match se lam sau bang matchModel.
    return res.status(200).json({
      success: true,
      message: "Da luu hanh dong",
      data: {
        matched: false,
        matchId: null
      }
    });
  } catch (error) {
    // In loi that ra terminal de de sua khi database hoac code gap van de.
    console.error("Loi gui Like/Pass:", error);

    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

// Cho phep route goi controller bang ten sendLike.
module.exports = {
  sendLike
};
