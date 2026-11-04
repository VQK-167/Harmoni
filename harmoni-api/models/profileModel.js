const pool = require("../config/db");

// 1. Tạo hồ sơ cá nhân
async function create({
    userId,
    displayName,
    dateOfBirth,
    gender,
    city,
    bio,
    connectionGoal
}) {
    const sql = `
        INSERT INTO profiles (
            user_id,
            display_name,
            date_of_birth,
            gender,
            city,
            bio,
            connection_goal
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
        userId,
        displayName,
        dateOfBirth,
        gender,
        city || null,
        bio || null,
        connectionGoal || "FRIENDSHIP"
    ]);

    return result.insertId;
}

// 2. Tìm hồ sơ theo ID người dùng
async function findByUserId(userId) {
    const sql = `
        SELECT *
        FROM profiles
        WHERE user_id = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [userId]);

    return rows[0] || null;
}

// 3. Cập nhật hồ sơ cá nhân
async function update(userId, fields) {
    const allowedFields = {
        displayName: "display_name",
        dateOfBirth: "date_of_birth",
        gender: "gender",
        city: "city",
        bio: "bio",
        connectionGoal: "connection_goal",
        avatarUrl: "avatar_url"
    };

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
        if (allowedFields[key]) {
            updates.push(`${allowedFields[key]} = ?`);
            values.push(value);
        }
    }

    if (updates.length === 0) {
        return false;
    }

    const sql = `
        UPDATE profiles
        SET ${updates.join(", ")}
        WHERE user_id = ?
    `;

    values.push(userId);

    const [result] = await pool.execute(sql, values);

    return result.affectedRows > 0;
}

module.exports = {
    create,
    findByUserId,
    update
};
