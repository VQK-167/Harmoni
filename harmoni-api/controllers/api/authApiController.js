const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const profileModel = require("../../models/profileModel");

//Kiem tra dinh dang email
function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// ĐĂNG KÝ
async function register(req, res) {
    try {
        const { email, password } = req.body;

        //Kiem tra du lieu dau vao
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ",
                data: null
            });
        }
        if(!password || password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
                data: null
            });
        }

        const emailClean = email.trim().toLowerCase();

        const existing = await userModel.findByEmail(emailClean);
        
        if(existing){
            return res.status(400).json({
                success: false,
                message: "Email đã được sử dụng",
                data: null
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await userModel.createUser({
            email: emailClean,
            passwordHash
        });

        return res.status(202).json({
            success: true,
            message: "Đăng ký thành công",
            data:{id: user.id, email: user.email}
        })

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
        const user = await userModel.findByEmail(String(email).trim().toLocaleLowerCase());

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
                data: null
            });
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
        const matched = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!matched) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
                data: null
            });
        }

        if(user.status !== "ACTIVE"){
            return res.status(403).json({
                success: false,
                message: "Tài khoản của bạn đã bị khóa",
                data: null
            });
        }

        req.session.userId = user.id;

        //Cap nhat thoi gian dang nhap lan cuoi
        await userModel.updateLastLogin(user.id);

        //Ktra co ho so chua?
        const profile = await profileModel.findByUserId(user.id);

        return res.json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                id: user.id,
                email: user.email,
                hasProfile: !!profile,
                displayName: profile ? profile.display_name : null,
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

        res.clearCookie("harmoni.sid");

        return res.json({
            success: true,
            message: "Đã đăng xuất",
            data: null
        });
    });
}

// KIỂM TRA NGƯỜI DÙNG HIỆN TẠI
async function me(req, res) {
    try {
        // Chưa đăng nhập
        if (!req.session || !req.session.userId) {
            return res.json({
                success: true,
                message: "Người dùng chưa đăng nhập",
                data: null
            });
        }

        const user = await userModel.findById(req.session.userId);

        if (!user || user.status !== "ACTIVE") {
            return res.json({
                success: true,
                message: "Chưa đăng nhập",
                data: null
            });
        }

        const profile = await profileModel.findByUserId(user.id);

        return res.json({
            success: true,
            message: "Lấy thông tin người dùng thành công",
            data: {
                id: user.id,
                email: user.email,
                hasProfile: !!profile,
                displayName: profile ? profile.display_name : null,
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
