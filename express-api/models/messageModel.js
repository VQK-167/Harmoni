// Du lieu tinh (in-memory) tin nhan giua user hien tai va cac profile da match.
// conversations: { "username_profileId": [{ sender: "me" | "them", text, time }] }

const conversations = {};

function getKey(username, profileId) {
    return `${username}_${profileId}`;
}

function getConversation(username, profileId) {
    return conversations[getKey(username, profileId)] || [];
}

function addMessage(username, profileId, sender, text) {
    const key = getKey(username, profileId);
    if (!conversations[key]) {
        conversations[key] = [];
    }

    const time = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });

    conversations[key].push({ sender, text, time });
}

function getLastMessage(username, profileId) {
    const list = getConversation(username, profileId);
    return list.length ? list[list.length - 1] : null;
}

module.exports = {
    getConversation,
    addMessage,
    getLastMessage
};
