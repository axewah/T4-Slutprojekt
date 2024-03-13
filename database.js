const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    port:3306,
    database:"slutprojekt"
});

module.exports = { user, user_create,
    house, houses, house_create, house_delete, house_update,
    task, tasks, task_create, task_delete, task_update, 
    worker, workers, worker_create, worker_delete, worker_update
};

async function user(email){
    const con = await pool.getConnection();

    const sql = "select email, password from user where email=?"
    const result = await con.query(sql,[email]);
    pool.releaseConnection(con);
    return result[0];
}

async function user_create(user){
    const con = await pool.getConnection();

    const sql = "INSERT INTO user (email, password) VALUES (?, ?)";
    const result = await con.query(sql, [user.email, user.password]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0].insertId;
}

async function houses(owner){
    const con = await pool.getConnection();

    const sql = "select * from house where owner=?";
    const result = await con.query(sql,[owner]);
    //console.log(result[0]); 
    pool.releaseConnection(con);
    return result[0];
}
async function house(address, owner){
    const con = await pool.getConnection();

    const sql = "select * from house where address=? and owner=?";
    const result = await con.query(sql, [address, owner]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function house_create(house, owner){
    const con = await pool.getConnection();

    const sql = "INSERT INTO house (address, owner, room, type, square_meters) VALUES (?, ?, ?, ?, ?)";
    const result = await con.query(sql, [house.address, owner, house.room, house.type, house.sqm]);
    console.log(result);
    pool.releaseConnection(con);
    return result[0].insertId;
} 
async function house_delete(address){
    const con = await pool.getConnection();

    const sql = "delete from house where address = ?";
    const result = await con.query(sql, [address]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function house_update(house, address){
    const con = await pool.getConnection();

    const sql = "update house set address=?, room=?, square_meters=? where address=?";
    const result = await con.query(sql, [house.address, house.room, house.sqm, address]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}


async function tasks(house){
    const con = await pool.getConnection();

    const sql = "select * from task where house=?";
    const result = await con.query(sql,[house]);
    //console.log(result[0]); 
    pool.releaseConnection(con);
    return result[0];
}
async function task(id, house){
    const con = await pool.getConnection();

    const sql = "select * from task where id=? and house=?";
    const result = await con.query(sql, [id, house]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function task_create(task, house){
    const con = await pool.getConnection();

    const sql = "INSERT INTO task (id, name, description, house, worker) VALUES (?, ?, ?, ?, ?)";
    const result = await con.query(sql, [task.id, task.name, task.desc, house, task.worker]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0].insertId;
}
async function task_delete(id){
    const con = await pool.getConnection();

    const sql = "delete from task where id = ?";
    const result = await con.query(sql, [id]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function task_update(task, id){
    const con = await pool.getConnection();

    const sql = "update task set name=?, description=?, worker=? where id=?";
    const result = await con.query(sql, [task.name, task.desc, task.worker, id]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}






async function workers(user){
    const con = await pool.getConnection();

    const sql = "select * from worker where invited_by = ?";
    const result = await con.query(sql, [user]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function worker(email){
    const con = await pool.getConnection();

    const sql = "select * from worker where email=?";
    const result = await con.query(sql, [email]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function worker_create(worker, user){
    const con = await pool.getConnection();

    const sql = "INSERT INTO worker (email, password, invited_by) VALUES (?, ?, ?)";
    const result = await con.query(sql, [worker.email, worker.password, user]);
    console.log(result[0]);
    pool.releaseConnection(con);
    return result[0].insertId;
}
async function worker_delete(email){
    const con = await pool.getConnection();

    const sql = "delete from worker where email = ?";
    const result = await con.query(sql, [email]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}
async function worker_update(worker, email){
    const con = await pool.getConnection();

    const sql = "update worker set email=?, password=? where email=?";
    const result = await con.query(sql, [worker.email, worker.password, email]);
    /* console.log(result); */
    pool.releaseConnection(con);
    return result[0];
}