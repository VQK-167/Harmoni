// Du lieu tinh (in-memory) - khi co BE/CSDL thuc su thi thay cac ham duoi day
// bang truy van toi bang users.

const users = [];

async function findUserByUsernameAndPassword(username, password) {
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
    return user || null;
}

async function findUserByUsername(username) {
    const user = users.find((u) => u.username === username);
    return user || null;
}

async function createUser({ username, password, fullname, age, gender, city }) {
    const colors = ["#ff5c77", "#3aa0ff", "#ffb13a", "#35c48f", "#9b5cff"];
    const newUser = {
        id: users.length + 1,
        username,
        password,
        fullname,
        age: Number(age) || 18,
        gender: gender || "Khác",
        city: city || "",
        bio: "Chào mọi người, mình mới tham gia!",
        interests: [],
        initials: fullname ? fullname.trim().charAt(0).toUpperCase() : "?",
        color: colors[users.length % colors.length]
    };

    users.push(newUser);
    return newUser;
}

async function updateOwnProfile(username, data) {
    const user = users.find((u) => u.username === username);
    if (!user) return null;

    user.fullname = data.fullname;
    user.age = data.age;
    user.city = data.city;
    user.bio = data.bio;
    user.interests = data.interests;

    return user;
}

module.exports = {
    users,
    findUserByUsernameAndPassword,
    findUserByUsername,
    createUser,
    updateOwnProfile
};
