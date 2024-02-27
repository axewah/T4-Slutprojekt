const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    port:3306,
    database:"slutprojekt"
});

module.exports = {house, houses, house_create, house_delete, house_update};

async function houses(owner){
    const con = await pool.getConnection();

    const sql = "select * from house where owner=?";
    const result = await con.query(sql,[owner]);
    console.log(result);
    pool.releaseConnection(con);
    return result[0];
}
async function house(address, owner){
    const con = await pool.getConnection();

    const sql = "select * from house where address=? and owner=?";
    const result = await con.query(sql, [address, owner]);
    console.log(result);
    pool.releaseConnection(con);
    return result[0];
}
async function house_create(house, owner){
    const con = await pool.getConnection();

    const sql = "INSERT INTO house (address, owner, room, type, `square meters`) VALUES (?, ?, ?, ?, ?)";
    const result = await con.query(sql, [house.address, owner, house.room, house.type, house.sqm]);
    console.log(result);
    pool.releaseConnection(con);
    return result[0].insertId;
} 
async function house_delete(address){
    const con = await pool.getConnection();

    const sql = "delete from house where address = ?";
    const result = await con.query(sql, [address]);
    console.log(result);
    pool.releaseConnection(con);
    return result[0];
}
async function house_update(house, address){
    const con = await pool.getConnection();

    const sql = "update house set address=?, room=?, `square meters`=? where address=?";
    const result = await con.query(sql, [house.address, house.room, house.sqm, address]);
    console.log(result);
    pool.releaseConnection(con);
    return result[0];
}

