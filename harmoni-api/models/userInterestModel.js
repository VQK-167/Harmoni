const pool = require("../config/db");

//luu hoac cap nhat so thich
async function setForUser(userId, interestIds) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        //xoa so thich cu
        await conn.execute(
            "DELETE FROM user_interests WHERE user_id = ?",
            [userId]
        );

        //loai bo id trung/ khong hop le
        const ids = [...new Set((interestIds || []).map(Number).filter((n) => Number.isInteger(n) && n > 0))];

        //them so thich moi
        if (ids.length > 0) {
            const values = ids.map((id) => [userId, id]);

            await conn.query(
                "INSERT INTO user_interests (user_id, interest_id) VALUES ?",
                [values]
            );
        }

        //luu thay doi
        await conn.commit();

        return ids;
    }
    catch (error){
        await conn.rollback();
        throw error;
    }finally{
        conn.release();
    }
}

//lay so thich cua mot nguoi dung
async function findByUserId(userId){
    const [rows] = await pool.execute(
        "SELECT interest_id FROM user_interests WHERE user_id = ?",
        [userId]
    );
    return rows.map((r) => r.interest_id);
}

//lay so thich cua nhieu nguoi dung
async function findByUserIds(userIds){
    const map = new Map();

    if(!userIds || userIds.length === 0){
        return map;
    }

    const placeholders = userIds.map(() => "?").join(", ");

    const [rows] = await pool.query(
        `SELECT user_id, interest_id FROM user_interests WHERE user_id IN (${placeholders})`,
        userIds
    );

    for(const r of rows){
        if(!map.has(r.user_id)){
            map.set(r.user_id, []);
        }
        map.get(r.user_id).push(r.interest_id);
    }
    return map;
}

module.exports = {
    setForUser,
    findByUserId,
    findByUserIds
};