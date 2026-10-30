
const profileModel = require("../../models/profileModel");

// Tính tuổi từ ngày sinh
function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

// Kiểm tra ngày sinh hợp lệ và đủ 18 tuổi
function validateDateOfBirth(dateOfBirth) {
    if (!dateOfBirth) {
        return "Vui lòng nhập ngày sinh";
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
        return "Ngày sinh không hợp lệ";
    }

    if (birthDate > new Date()) {
        return "Ngày sinh không được ở tương lai";
    }

    if (calculateAge(dateOfBirth) < 18) {
        return "Bạn phải từ 18 tuổi trở lên";
    }

    return null;
}

// 1. TẠO HỒ SƠ
async function createProfile(req, res) {
    try {
        const userId = req.session.userId;

        const {
            displayName,
            dateOfBirth,
            gender,
            city,
            bio,
            connectionGoal
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!displayName || !dateOfBirth || !gender || !city || !connectionGoal) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin hồ sơ",
                data: null
            });
        }

        // Kiểm tra ngày sinh
        const dateError = validateDateOfBirth(dateOfBirth);

        if (dateError) {
            return res.status(400).json({
                success: false,
                message: dateError,
                data: null
            });
        }

        // Kiểm tra người dùng đã có hồ sơ chưa
        const existingProfile = await profileModel.findByUserId(userId);

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Bạn đã có hồ sơ cá nhân",
                data: null
            });
        }

        // Tạo hồ sơ
        await profileModel.create({
            userId,
            displayName,
            dateOfBirth,
            gender,
            city,
            bio: bio || null,
            connectionGoal
        });

        // Lấy lại hồ sơ vừa tạo
        const newProfile = await profileModel.findByUserId(userId);

        return res.status(201).json({
            success: true,
            message: "Tạo hồ sơ thành công",
            data: newProfile
        });

    } catch (error) {
        console.error("Lỗi tạo hồ sơ:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo hồ sơ",
            data: null
        });
    }
}

// 2. XEM HỒ SƠ CỦA TÔI
async function getMyProfile(req, res) {
    try {
        const userId = req.session.userId;

        const profile = await profileModel.findByUserId(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Bạn chưa tạo hồ sơ cá nhân",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy hồ sơ thành công",
            data: profile
        });

    } catch (error) {
        console.error("Lỗi lấy hồ sơ:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy hồ sơ",
            data: null
        });
    }
}

// 3. CẬP NHẬT HỒ SƠ
async function updateProfile(req, res) {
    try {
        const userId = req.session.userId;

        const {
            displayName,
            dateOfBirth,
            gender,
            city,
            bio,
            connectionGoal,
            avatarUrl
        } = req.body;

        // Chỉ cho phép cập nhật những trường được quy định
        const fields = {};

        if (displayName !== undefined) fields.displayName = displayName;
        if (dateOfBirth !== undefined) fields.dateOfBirth = dateOfBirth;
        if (gender !== undefined) fields.gender = gender;
        if (city !== undefined) fields.city = city;
        if (bio !== undefined) fields.bio = bio;
        if (connectionGoal !== undefined) fields.connectionGoal = connectionGoal;
        if (avatarUrl !== undefined) fields.avatarUrl = avatarUrl;

        // Không có thông tin nào được gửi lên
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp thông tin cần cập nhật",
                data: null
            });
        }

        // Nếu cập nhật ngày sinh thì kiểm tra lại độ tuổi
        if (dateOfBirth !== undefined) {
            const dateError = validateDateOfBirth(dateOfBirth);

            if (dateError) {
                return res.status(400).json({
                    success: false,
                    message: dateError,
                    data: null
                });
            }
        }

        // Cập nhật hồ sơ
        await profileModel.update(userId, fields);

        // Lấy lại dữ liệu sau khi cập nhật
        const updatedProfile = await profileModel.findByUserId(userId);

        return res.status(200).json({
            success: true,
            message: "Cập nhật hồ sơ thành công",
            data: updatedProfile
        });

    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật hồ sơ",
            data: null
        });
    }
}

module.exports = {
    createProfile,
    getMyProfile,
    updateProfile
};
