const profileModel = require("../models/profileModel");
const matchModel = require("../models/matchModel");

async function index(req, res) {
    try {
        const username = req.session.user.username;
        const list = profileModel.getDiscoverList(username);
        const current = list[0] || null;
        const remaining = list.length > 0 ? list.length - 1 : 0;

        res.render("discover/index", { current, remaining, matched: null });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi tải danh sách khám phá");
    }
}

async function like(req, res) {
    try {
        const username = req.session.user.username;
        const profileId = req.params.id;

        const profile = profileModel.getProfileById(profileId);
        profileModel.recordSwipe(username, profileId, "like");

        let matched = false;
        if (profile && profile.likesYouBack) {
            matchModel.addMatch(username, profileId);
            matched = true;
        }

        if (matched) {
            const list = profileModel.getDiscoverList(username);
            return res.render("discover/index", {
                current: list[0] || null,
                remaining: list.length > 0 ? list.length - 1 : 0,
                matched: profile
            });
        }

        res.redirect("/discover");
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi thích hồ sơ");
    }
}

async function pass(req, res) {
    try {
        const username = req.session.user.username;
        const profileId = req.params.id;

        profileModel.recordSwipe(username, profileId, "pass");

        res.redirect("/discover");
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi bỏ qua hồ sơ");
    }
}

module.exports = {
    index,
    like,
    pass
};
