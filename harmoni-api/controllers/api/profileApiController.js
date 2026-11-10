const profileModel = require("../../models/profileModel");
const userInterestModel = require("../../models/userInterestModel");

const GENDER = ["MALE", "FEMALE", "OTHER", "UNDISCLOSED"];
const CONNECTION_GOAL = ["FRIENDSHIP", "DATING", "LONG_TERM"];

// Tính tuổi từ ngày sinh
function calcAge(dateOfBirth) {
    const today = new Date();
    const birth = new Date(dateOfBirth);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
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

    const birth = new Date(dateOfBirth);

    if (Number.isNaN(birth.getTime())) {
        return "Ngày sinh không hợp lệ";
    }

    if (birth > new Date()) {
        return "Ngày sinh không được ở tương lai";
    }

    if (calcAge(dateOfBirth) < 18) {
        return "Bạn phải từ 18 tuổi trở lên";
    }

    return null;
}

//Dinh dang dung cho react
function toApiProfile(profile, interestIds){
    return{
    userId: profile.user_id,
    displayName: profile.display_name,
    dateOfBirth: profile.date_of_birth,
    age: calcAge(profile.date_of_birth),
    gender: profile.gender,
    city: profile.city,
    bio: profile.bio,
    connectionGoal: profile.connection_goal,
    avatarUrl: profile.avatar_url,
    interestIds: interestIds || []
    };
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
            connectionGoal,
            interestIds
        } = req.body;

        if (!displayName || !String(displayName).trim()) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập tên hiển thị",
                data: null
            });
        }

        if(!city || !String(city).trim()){
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập thành phố",
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

        const genderValue = gender || "UNDISCLOSED";

        if(!GENDER.includes(genderValue)){
            return res.status(400).json({
                success: false,
                message: "Giới tính không hợp lệ",
                data: null
            });
        }

        const goalValue = connectionGoal || "FRIENDSHIP";

        if(!CONNECTION_GOAL.includes(goalValue)){
            return res.status(400).json({
                success: false,
                message: "Mục tiêu kết nối không hợp lệ",
                data: null
            });
        }

        // Kiểm tra người dùng đã có hồ sơ chưa
        const existingProfile = await profileModel.findByUserId(userId);

        if(existingProfile){
            return res.status(409).json({
                success: false,
                message: "Bạn đã có hồ sơ cá nhân",
                data: null
            });
        }

        // Tạo hồ sơ
        await profileModel.create({
            userId,
            displayName: String(displayName).trim(),
            dateOfBirth,
            gender: genderValue,
            city: String(city).trim(),
            bio: bio ? String(bio).trim() : null,
            connectionGoal: goalValue
        });

        const saveIds = await userInterestModel.setForUser(userId, interestIds);

        const profile = await profileModel.findByUserId(userId);

        return res.status(201).json({
            success: true,
            message: "Tạo hồ sơ thành công",
            data: toApiProfile(profile, saveIds)
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

// XEM HỒ SƠ CỦA TÔI
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

        const interestIds = await userInterestModel.findByUserId(userId);

        return res.status(200).json({
            success: true,
            message: "Lấy hồ sơ thành công",
            data: toApiProfile(profile, interestIds)
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
        } = req.body;

        // cho phep cap nhat trong truong quy dinh
        const fields = {};

        if (displayName !== undefined){
            if(!String(displayName).trim()){
                return res.status(400).json({
                    success: false,
                    message: "Tên hiển thị không được để trống",
                    data: null
                });
            }
            fields.displayName = String(displayName).trim();
        }

        if (dateOfBirth !== undefined){
            const dateError = validateDateOfBirth(dateOfBirth);
            if(dateError){
                return res.status(400).json({
                    success: false,
                    message: dateError,
                    data: null
                });
            }
            fields.dateOfBirth = dateOfBirth;
        }

        if (gender !== undefined){
            if(!GENDER.includes(gender)){
                return res.status(400).json({
                    success: false,
                    message: "Giới tính không hợp lệ",
                    data: null
                });
            }
            fields.gender = gender;
        }

        if(connectionGoal !== undefined){
            if(!CONNECTION_GOAL.includes(connectionGoal)){
                return res.status(400).json({
                    success: false,
                    message: "Mục tiêu kết nối không hợp lệ",
                    data: null
                });
            }
            fields.connectionGoal = connectionGoal;
        }

        if (city !== undefined) fields.city = String(city).trim();;
        if (bio !== undefined) fields.bio = String(bio).trim();

        // Không có thông tin nào được gửi lên
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp thông tin cần cập nhật",
                data: null
            });
        }

        const profile = await profileModel.update(userId, fields);
        const interestIds = await userInterestModel.findByUserId(userId);

        return res.json({
            success: true,
            message: "Cập nhật hồ sơ thành công",
            data: toApiProfile(profile, interestIds)
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

//Cap nhat rieng so thich
async function updateInterests(req, res){
    try{
        const userid = req.session.userId;
        const {interestIds} = req.body;

        if(!Array.isArray(interestIds)){
            return res.status(400).json({
                success: false,
                message: "interestIds phải là một mảng",
                data: null
            });
        }
        const saveIds = await userInterestModel.setForUser(
            userid,
            interestIds
        );
        const profile = await profileModel.findByUserId(userid);

        return res.status(200).json({
            success: true,
            message: "Cập nhật sở thích thành công",
            data: toApiProfile(profile, saveIds)
        });
    }
    catch(err){
        console.error("Lỗi cập nhật sở thích", err);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            data: null
        });
    }
}

module.exports = {
    createProfile,
    getMyProfile,
    updateProfile,
    updateInterests
};
