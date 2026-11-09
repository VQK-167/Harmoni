const pool = require("../config/db");

const FIELD_MAP = {
    displayName: "displayname",
    dateOfBirth: "dateofbirth",
    gender: "gender",
    city: "city",
    bio: "bio",
    connectionGoal: "connectiongoal",
}

// 1. Tạo hồ sơ cá nhân
async function create({
    userId, displayName, dateOfBirth, gender, city, bio, connectionGoal}) {
    await pool.execute(
        "INSERT INTO profiles (user_id, display_name, date_of_birth, gender, city, bio, connection_goal) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, displayName, dateOfBirth, gender, city || null, bio || null, connectionGoal]
    );

    return findByUserId(userId);
}

// 2. Tìm hồ sơ theo ID người dùng
async function findByUserId(userId) {
    const [rows] = await pool.execute(
        "SELECT * FROM profiles WHERE user_id = ? LIMIT 1",
        [userId]
    );

    return rows[0] || null;
}

async function findByUserIds(userIds) {
  if (!userIds || userIds.length === 0) {
    return [];
  }

  const placeholders = userIds.map(() => "?").join(", ");

  const [rows] = await pool.query(
    "SELECT * FROM profiles WHERE user_id IN (${placeholders})",
    userIds
  );

  return rows;
}

// 3. Cập nhật hồ sơ
async function update(userId, fields) {
    const sets = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
        if (FIELD_MAP[key]) {
            sets.push(`${FIELD_MAP[key]} = ?`);
            values.push(value);
        }
    }

    if (sets.length === 0) {
        return findByUserId(userId);
    }

    values.push(userId);

    await pool.execute(
        "UPDATE profiles SET ${sets.join(", ")} WHERE user_id = ?",
        values
    );

    return findByUserId(userId);
}

module.exports = {
    create,
    findByUserId,
    findByUserIds,
    update
};
