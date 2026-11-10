const likeModel = require("../../models/likeModel");
const matchModel = require("../../models/matchModel");

// Xu ly request like hoac pass.
async function sendLike(req, res) {
  try {
    const senderId = req.session.userId;
    const { receiverId, action } = req.body;
    const receiverIdNumber = Number(receiverId);

    // Kiem tra receiverId co phai so nguyen duong khong.
    if (!Number.isInteger(receiverIdNumber) || receiverIdNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "receiverId khong hop le",
        data: null
      });
    }

    // Khong cho user tu like hoac pass chinh minh.
    if (receiverIdNumber === senderId) {
      return res.status(400).json({
        success: false,
        message: "Ban khong the Like hoac Pass chinh minh",
        data: null
      });
    }

    // Chi chap nhan LIKE hoac PASS.
    if (action !== "LIKE" && action !== "PASS") {
      return res.status(400).json({
        success: false,
        message: "action phai la LIKE hoac PASS",
        data: null
      });
    }

    // Luu hanh dong cua sender doi voi receiver.
    await likeModel.upsert({
      senderId,
      receiverId: receiverIdNumber,
      action
    });

    // Chi LIKE moi co the tao Match.
    if (action === "LIKE") {
      // Kiem tra receiver da LIKE nguoc lai sender chua.
      const reverseLike = await likeModel.findBySenderAndReceiver(
        receiverIdNumber,
        senderId
      );

      if (reverseLike && reverseLike.action === "LIKE") {
        // Tim match cu giua hai user.
        let match = await matchModel.findByPair(senderId, receiverIdNumber);

        if (!match) {
          // Chua co match thi tao moi.
          match = await matchModel.create({
            user1Id: senderId,
            user2Id: receiverIdNumber
          });
        } else if (match.status === "UNMATCHED") {
          // Co match cu nhung da huy thi kich hoat lai.
          await matchModel.setActive(match.id);
          match = await matchModel.findById(match.id);
        }

        return res.status(200).json({
          success: true,
          message: "Da tao Match",
          data: {
            matched: true,
            matchId: match.id
          }
        });
      }
    }

    // LIKE mot chieu hoac PASS thi chua co Match.
    return res.status(200).json({
      success: true,
      message: "Da luu hanh dong",
      data: {
        matched: false,
        matchId: null
      }
    });
  } catch (error) {
    console.error("Loi gui Like/Pass:", error);

    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

module.exports = {
  sendLike
};
