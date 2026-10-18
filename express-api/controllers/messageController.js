const matchModel = require("../models/matchModel");
const profileModel = require("../models/profileModel");
const messageModel = require("../models/messageModel");

async function index(req, res) {
    try {
        const username = req.session.user.username;
        const matchIds = matchModel.getMatches(username);

        const conversations = matchIds
            .map((id) => profileModel.getProfileById(id))
            .filter(Boolean)
            .map((profile) => ({
                profile,
                lastMessage: messageModel.getLastMessage(username, profile.id)
            }));

        res.render("messages/index", { conversations });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi tải danh sách tin nhắn");
    }
}

async function show(req, res) {
    try {
        const username = req.session.user.username;
        const profileId = req.params.id;

        if (!matchModel.isMatched(username, profileId)) {
            return res.status(404).send("Bạn chưa match với người này");
        }

        const profile = profileModel.getProfileById(profileId);
        const messages = messageModel.getConversation(username, profileId);

        res.render("messages/show", { profile, messages });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi mở đoạn chat");
    }
}

async function send(req, res) {
    try {
        const username = req.session.user.username;
        const profileId = req.params.id;
        const text = (req.body.text || "").trim();

        if (text) {
            messageModel.addMessage(username, profileId, "me", text);
        }

        res.redirect(`/messages/${profileId}`);
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi gửi tin nhắn");
    }
}

module.exports = {
    index,
    show,
    send
};
