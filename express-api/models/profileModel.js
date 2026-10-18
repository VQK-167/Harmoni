// Du lieu tinh (in-memory) danh sach ho so de "kham pha" (discover/swipe).
// likesYouBack: gia lap viec nguoi kia da thich minh truoc -> neu minh bam "Thich"
// thi se tao thanh 1 match ngay (phuc vu demo giao dien, chua co logic BE thuc su).

const profiles = [];

// swipedByUser: { username: { [profileId]: "like" | "pass" } }
const swipedByUser = {};

function getProfileById(id) {
    return profiles.find((p) => p.id === Number(id)) || null;
}

function getDiscoverList(username) {
    const swiped = swipedByUser[username] || {};
    return profiles.filter((p) => !swiped[p.id]);
}

function recordSwipe(username, profileId, action) {
    if (!swipedByUser[username]) {
        swipedByUser[username] = {};
    }
    swipedByUser[username][Number(profileId)] = action;
}

module.exports = {
    profiles,
    getProfileById,
    getDiscoverList,
    recordSwipe
};
