const profileModel = require("../models/profileModel");

// Kiểm tra người dùng đã đăng nhập chưa
function requireApiLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Bạn cần đăng nhập trước",
            data: null
        });
    }

    next();
}

// Kiểm tra người dùng đã có hồ sơ chưa
async function requireProfile(req, res, next) {
    // Kiểm tra đăng nhập trước
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Bạn cần đăng nhập trước",
            data: null
        });
    }

    try {
        const profile = await profileModel.findByUserId(
            req.session.userId
        );

        if (!profile) {
            return res.status(403).json({
                success: false,
                message: "Bạn cần tạo hồ sơ trước",
                data: null
            });
        }

        next();

    } catch (error) {
        console.error("Lỗi kiểm tra hồ sơ:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            data: null
        });
    }
}

module.exports = {
    requireApiLogin,
    requireProfile
};
