const userModel = require("../models/userModel");

function showLogin(req, res) {
    res.render("auth/login", { error: null });
}

async function login(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await userModel.findUserByUsernameAndPassword(
            username,
            password
        );

        if (!user) {
            return res.render("auth/login", {
                error: "Sai tài khoản hoặc mật khẩu"
            });
        }

        req.session.user = {
            username: user.username,
            fullname: user.fullname,
            initials: user.initials,
            color: user.color
        };

        res.redirect("/discover");
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi đăng nhập");
    }
}

function showRegister(req, res) {
    res.render("auth/register", { error: null });
}

async function register(req, res) {
    try {
        const { username, password, fullname, age, gender, city } = req.body;

        const existed = await userModel.findUserByUsername(username);
        if (existed) {
            return res.render("auth/register", {
                error: "Tên đăng nhập đã tồn tại"
            });
        }

        await userModel.createUser({ username, password, fullname, age, gender, city });

        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi đăng ký");
    }
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/");
    });
}

module.exports = {
    showLogin,
    login,
    showRegister,
    register,
    logout
};
