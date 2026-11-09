const pool = require("../config/db");

//lay danh sach so thich dang hoat dong
async function findAll(){
    const [rows] = await pool.execute(
        "SELECT id, name, slug FROM interests WHERE is_active = 1 ORDER BY name ASC"
    );
    return rows;
}

//lay danh sach id so thich dang hoat dong
async function findAllIds(){
    const [rows] = await pool.execute(
        "SELECT id FROM interests WHERE is_active = 1"
    );
    return rows.map((r) => r.id);
}

module.exports = {
    findAll,
    findAllIds
};