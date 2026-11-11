const matchModel = require("../../models/matchModel");
const messageModel = require("../../models/messageModel");
const profileModel = require("../../models/profileModel");
const blockModel = require("../../models/blockModel");
const likeModel = require("../../models/likeModel");

// Kiem tra match ton tai va user hien tai co thuoc match khong.
async function getUserMatch(matchId, userId) {
  const match = await matchModel.findById(matchId);

  if (!match) {
    return { error: "NOT_FOUND", match: null };
  }

  if (match.user1_id !== userId && match.user2_id !== userId) {
    return { error: "FORBIDDEN", match: null };
  }

  return { error: null, match };
}

// Lay danh sach match dang ACTIVE cua user hien tai.
async function getMatches(req, res) {
  try {
    const userId = req.session.userId;
    const matches = await matchModel.findActiveByUserId(userId);
    const data = [];

    for (const match of matches) {
      const otherUserId = match.user1_id === userId
        ? match.user2_id
        : match.user1_id;
      const profile = await profileModel.findByUserId(otherUserId);

      data.push({
        matchId: match.id,
        matchedAt: match.matched_at,
        otherUser: profile
          ? {
              userId: profile.user_id,
              displayName: profile.display_name,
              city: profile.city,
              avatarUrl: profile.avatar_url
            }
          : null,
        lastMessage: await messageModel.findLastByMatchId(match.id)
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lay danh sach Match thanh cong",
      data
    });
  } catch (error) {
    console.error("Loi lay danh sach Match:", error);
    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

// Huy mot match.
async function unmatch(req, res) {
  try {
    const userId = req.session.userId;
    const matchId = Number(req.params.id);
    const result = await getUserMatch(matchId, userId);

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay Match",
        data: null
      });
    }

    if (result.error === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen voi Match nay",
        data: null
      });
    }

    await matchModel.setUnmatched(matchId);

    // Xoa Like hai chieu de hai user co the thay lai nhau trong Discovery.
    const otherUserId = result.match.user1_id === userId
      ? result.match.user2_id
      : result.match.user1_id;
    await likeModel.removePair(userId, otherUserId);

    return res.status(200).json({
      success: true,
      message: "Da huy Match",
      data: null
    });
  } catch (error) {
    console.error("Loi huy Match:", error);
    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

// Lay lich su tin nhan cua mot match.
async function getMessages(req, res) {
  try {
    const userId = req.session.userId;
    const matchId = Number(req.params.id);
    const afterId = req.query.afterId;
    const result = await getUserMatch(matchId, userId);

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay Match",
        data: null
      });
    }

    if (result.error === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen xem tin nhan",
        data: null
      });
    }

    const messages = await messageModel.findByMatchId(matchId, afterId);

    return res.status(200).json({
      success: true,
      message: "Lay tin nhan thanh cong",
      data: {
        messages,
        matchStatus: result.match.status
      }
    });
  } catch (error) {
    console.error("Loi lay tin nhan:", error);
    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

// Gui tin nhan trong mot match dang ACTIVE.
async function sendMessage(req, res) {
  try {
    const userId = req.session.userId;
    const matchId = Number(req.params.id);
    const content = String(req.body.content || "").trim();
    const result = await getUserMatch(matchId, userId);

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay Match",
        data: null
      });
    }

    if (result.error === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen gui tin nhan",
        data: null
      });
    }

    const otherUserId = result.match.user1_id === userId
      ? result.match.user2_id
      : result.match.user1_id;
    const isBlocked = await blockModel.isBlockedEitherWay(userId, otherUserId);

    if (isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Khong the gui tin nhan voi nguoi da chan",
        data: null
      });
    }

    if (result.match.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Match da bi huy, khong the gui tin nhan",
        data: null
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Noi dung tin nhan khong duoc de trong",
        data: null
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Tin nhan toi da 1000 ky tu",
        data: null
      });
    }

    const messageId = await messageModel.create({
      matchId,
      senderId: userId,
      content
    });

    return res.status(201).json({
      success: true,
      message: "Gui tin nhan thanh cong",
      data: { id: messageId, matchId, senderId: userId, content }
    });
  } catch (error) {
    console.error("Loi gui tin nhan:", error);
    return res.status(500).json({
      success: false,
      message: "Loi server",
      data: null
    });
  }
}

module.exports = {
  getMatches,
  unmatch,
  getMessages,
  sendMessage
};
