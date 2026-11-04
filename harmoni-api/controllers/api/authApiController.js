
const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const profileModel = require("../../models/profileModel");

// ĐĂNG KÝ
async function register(req, res) {
    try {
        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập email và mật khẩu",
                data: null
            });
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ",
                data: null
            });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
                data: null
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email đã được sử dụng",
                data: null
            });
        }

        // Mã hóa mật khẩu
        const passwordHash = await bcrypt.hash(password, 10);

        // Tạo tài khoản
        const userId = await userModel.createUser({
            email,
            passwordHash
        });

        return res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            data: {
                id: userId,
                email
            }
        });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi đăng ký",
            data: null
        });
    }
}

// ĐĂNG NHẬP
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập email và mật khẩu",
                data: null
            });
        }

        // Tìm tài khoản theo email
        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
                data: null
            });
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
                data: null
            });
        }

        // Lưu ID người dùng vào session
        req.session.userId = user.id;

        // Kiểm tra người dùng đã có hồ sơ chưa
        const profile = await profileModel.findByUserId(user.id);

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                id: user.id,
                email: user.email,
                hasProfile: !!profile
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi đăng nhập",
            data: null
        });
    }
}

// ĐĂNG XUẤT
function logout(req, res) {
    if (!req.session) {
        return res.json({
            success: true,
            message: "Đăng xuất thành công",
            data: null
        });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Lỗi đăng xuất:", error);

            return res.status(500).json({
                success: false,
                message: "Không thể đăng xuất",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
            data: null
        });
    });
}

// KIỂM TRA NGƯỜI DÙNG HIỆN TẠI
async function me(req, res) {
    try {
        // Chưa đăng nhập
        if (!req.session || !req.session.userId) {
            return res.status(200).json({
                success: true,
                message: "Người dùng chưa đăng nhập",
                data: null
            });
        }

        const user = await userModel.findById(req.session.userId);

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "Không tìm thấy tài khoản",
                data: null
            });
        }

        const profile = await profileModel.findByUserId(user.id);

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin người dùng thành công",
            data: {
                id: user.id,
                email: user.email,
                hasProfile: !!profile
            }
        });

    } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            data: null
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    me
};
