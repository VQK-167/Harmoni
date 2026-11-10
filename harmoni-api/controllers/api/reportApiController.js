const reportModel = require("../../models/reportModel");
const profileModel = require("../../models/profileModel");

// SAF-03: bao cao nguoi dung
async function reportUser(req, res) {
  try {
    const userId = req.session.userId;

    // req.body co the gui chuoi -> chuan hoa ve so
    const reportedId = Number(req.body.reportedId);
    const { reason, description } = req.body;

    //Thieu hoac sai reportedId
    if (!Number.isInteger(reportedId) || reportedId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu hoặc sai reportedId",
        data: null,
      });
    }

    if (reportedId === userId) {
      return res.status(400).json({
        success: false,
        message: "Không thể tự báo cáo chính mình",
        data: null,
      });
    }

    if (!reportModel.REASONS.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Lý do báo cáo không hợp lệ",
        data: null,
      });
    }

    if (description && String(description).trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Mô tả tối đa 1000 ký tự",
        data: null,
      });
    }

    //Nguoi bi bao cao phai ton tai
    const targetProfile = await profileModel.findByUserId(reportedId);

    if (!targetProfile) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng này",
        data: null,
      });
    }

    //Chan bao cao trung khi van con mot bao cao dang PENDING
    const pending = await reportModel.findPending(userId, reportedId);

    if (pending) {
      return res.status(409).json({
        success: false,
        message: "Bạn đã có một báo cáo đang chờ xử lý với người này",
        data: null,
      });
    }

    const reportId = await reportModel.create({
      reporterId: userId,
      reportedId,
      reason,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Đã gửi báo cáo, Harmoni sẽ xem xét sớm nhất",
      data: { reportId },
    });
  } catch (error) {
    console.error("Lỗi báo cáo người dùng:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi gửi báo cáo",
      data: null,
    });
  }
}

module.exports = {
  reportUser,
};
