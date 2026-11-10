const blockModel = require("../../models/blockModel");
const profileModel = require("../../models/profileModel");
const matchModel = require("../../models/matchModel"); // module cua Huy

// SAF-01: chan nguoi dung
async function blockUser(req, res) {
  try {
    const userId = req.session.userId;

    // req.body co the gui chuoi -> chuan hoa ve so
    const targetId = Number(req.body.userId);

    // 1. Thieu hoac sai userId
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu hoặc sai userId",
        data: null,
      });
    }

    // 2. Bang blocks co CHECK (blocker_id <> blocked_id).
    //    Chan o day de tra 400, khong de MySQL throw -> 500.
    if (targetId === userId) {
      return res.status(400).json({
        success: false,
        message: "Không thể tự chặn chính mình",
        data: null,
      });
    }

    // 3. Nguoi bi chan phai ton tai
    const targetProfile = await profileModel.findByUserId(targetId);

    if (!targetProfile) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng này",
        data: null,
      });
    }

    // 4. INSERT IGNORE -> chan lai nguoi da chan khong bao loi.
    //    created = false nghia la da chan san tu truoc.
    const created = await blockModel.create({
      blockerId: userId,
      blockedId: targetId,
    });

    // 5. SAF-01: chan thi phai huy match dang ACTIVE voi nguoi do.
    //    TODO: BO try/catch nay khi matchModel cua Huy da vao main.
    //    Hien matchModel con rong nen goi ham se nem TypeError.
    try {
      const match = await matchModel.findByPair(userId, targetId);

      if (match && match.status === "ACTIVE") {
        await matchModel.setUnmatched(match.id);
      }
    } catch (err) {
      console.warn("Chua huy duoc match (matchModel chua san sang):", err.message);
    }

    return res.json({
      success: true,
      message: created
        ? "Đã chặn người dùng"
        : "Bạn đã chặn người này từ trước",
      data: null,
    });
  } catch (error) {
    console.error("Lỗi chặn người dùng:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi chặn người dùng",
      data: null,
    });
  }
}

// SAF-02: danh sach nguoi minh da chan
async function getBlocks(req, res) {
  try {
    const list = await blockModel.findByBlockerId(req.session.userId);

    return res.json({
      success: true,
      message: "Lấy danh sách đã chặn thành công",
      data: list,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách chặn:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách chặn",
      data: null,
    });
  }
}

// SAF-02: bo chan. Khong khoi phuc lai match cu -
// hai nguoi phai Like lai nhau tu dau.
async function unblockUser(req, res) {
  try {
    const userId = req.session.userId;

    // req.params LUON la chuoi -> bat buoc chuan hoa
    const targetId = Number(req.params.userId);

    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({
        success: false,
        message: "userId không hợp lệ",
        data: null,
      });
    }

    const removed = await blockModel.remove(userId, targetId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Bạn chưa chặn người này",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Đã bỏ chặn",
      data: null,
    });
  } catch (error) {
    console.error("Lỗi bỏ chặn:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi bỏ chặn",
      data: null,
    });
  }
}

module.exports = {
  blockUser,
  getBlocks,
  unblockUser,
};
