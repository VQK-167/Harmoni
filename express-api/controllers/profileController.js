const userModel = require("../models/userModel");

async function show(req, res) {
    try {
        const username = req.session.user.username;
        const profile = await userModel.findUserByUsername(username);

        res.render("profile/show", { profile });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi xem hồ sơ cá nhân");
    }
}

async function edit(req, res) {
    try {
        const username = req.session.user.username;
        const profile = await userModel.findUserByUsername(username);

        res.render("profile/edit", { profile });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi mở form sửa hồ sơ");
    }
}

async function update(req, res) {
    try {
        const username = req.session.user.username;
        const { fullname, age, city, bio, interests } = req.body;

        const interestList = (interests || "")
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);

        await userModel.updateOwnProfile(username, {
            fullname,
            age,
            city,
            bio,
            interests: interestList
        });

        req.session.user.fullname = fullname;

        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi cập nhật hồ sơ");
    }
}

module.exports = {
    show,
    edit,
    update
};
