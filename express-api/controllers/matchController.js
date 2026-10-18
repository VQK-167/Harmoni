const matchModel = require("../models/matchModel");
const profileModel = require("../models/profileModel");

async function index(req, res) {
    try {
        const username = req.session.user.username;
        const matchIds = matchModel.getMatches(username);
        const matches = matchIds
            .map((id) => profileModel.getProfileById(id))
            .filter(Boolean);

        res.render("matches/index", { matches });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi tải danh sách match");
    }
}

module.exports = {
    index
};
