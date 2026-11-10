const matchModel = require("../../models/matchModel");
const profileModel = require("../../models/profileModel");

// Lay danh sach match dang ACTIVE cua user hien tai.
async function getMatches(req, res) {
  try {
    const userId = req.session.userId;
    const matches = await matchModel.findActiveByUserId(userId);

    const data = [];

    for (const match of matches) {
      // Xac dinh ID nguoi con lai trong match.
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
          : null
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
    const match = await matchModel.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay Match",
        data: null
      });
    }

    // Khong cho user khong lien quan huy match cua nguoi khac.
    if (match.user1_id !== userId && match.user2_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen voi Match nay",
        data: null
      });
    }

    await matchModel.setUnmatched(matchId);

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

// Phan Messaging se hoan thien sau.
function notImplemented(req, res) {
  return res.status(501).json({
    success: false,
    message: "Chua trien khai",
    data: null
  });
}

module.exports = {
  getMatches,
  unmatch,
  getMessages: notImplemented,
  sendMessage: notImplemented
};
