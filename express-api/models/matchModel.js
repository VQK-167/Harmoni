// Du lieu tinh (in-memory) danh sach "match" cua moi user.
// matchesByUser: { username: [profileId, ...] }

const matchesByUser = {};

function getMatches(username) {
    return matchesByUser[username] || [];
}

function isMatched(username, profileId) {
    return getMatches(username).includes(Number(profileId));
}

function addMatch(username, profileId) {
    if (!matchesByUser[username]) {
        matchesByUser[username] = [];
    }
    if (!matchesByUser[username].includes(Number(profileId))) {
        matchesByUser[username].push(Number(profileId));
    }
}

module.exports = {
    getMatches,
    isMatched,
    addMatch
};
