const express = require("express");
const db = require("./database");

const app = express();

const PORT = 1234;
app.listen(PORT,err=>{
    if(err) return console.log(err);
    console.log("http://localhost:"+PORT);
});

app.get("/",(req,res)=>{
    res.send("index Page");
});

const user = "exampleUser@gmail.com";



app.get("/house", async (req,res)=>{
    try {
        res.send(await db.houses(user));
    } catch (error) {
        res.send(error);
    }
});

app.get("/house/:address", async (req,res)=>{
    try {
        const {address} = req.params;
        res.send(await db.house(address, user));
    } catch (error) {
        res.send(error);
    }
});

app.post("/house/:address/:room/:type/:sqm", async (req,res)=>{
    try {
        const {address, room, type, sqm} = req.params;
        await db.house_create({address, room, type, sqm}, user);
        res.send({address, room, type, sqm});
    } catch (error) {
        res.send(error);
    }
});

app.put("/house/:oldaddress/:address/:room/:type/:sqm", async (req,res)=>{
    try {
        const {oldaddress, address, room, type, sqm} = req.params;
        db.house_update({address, room, type, sqm}, oldaddress);
        res.send({address, room, type, sqm});
    } catch (error) {
        res.send(error);
    }
});

app.delete("/house/:address", async (req,res)=>{
    try {
        const {address} = req.params;
        db.house_delete(address);
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
});








app.get("/tasks/:address", async (req,res)=>{
    try {
        const {address} = req.params;
        res.send(await db.tasks(address));
    } catch (error) {
        res.send(error);
    }
});

app.get("/task/:id/:address", async (req,res)=>{
    try {
        const {id, address} = req.params;
        res.send(await db.task(id, address));
    } catch (error) {
        res.send(error);
    }
});

app.post("/task/:name/:desc/:address", async (req,res)=>{
    try {
        const {name, desc, address} = req.params;
        await db.task_create({name, desc}, address);
        res.send({name, desc});
    } catch (error) {
        res.send(error);
    }
});

app.put("/task/:id/:name/:desc", async (req,res)=>{
    try {
        const {id, name, desc} = req.params;
        db.task_update({name, desc}, id);
        res.send({name, desc});
    } catch (error) {
        res.send(error);
    }
});

app.delete("/task/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        db.task_delete(id);
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
});






app.get("/workers/:task_id", async (req,res)=>{
    try {
        const {task_id} = req.params;
        res.send(await db.workers(task_id));
    } catch (error) {
        res.send(error);
    }
});

app.get("/worker/:email", async (req,res)=>{
    try {
        const {email} = req.params;
        res.send(await db.worker(email));
    } catch (error) {
        res.send(error);
    }
});

app.post("/worker/:email/:password/:task_id", async (req,res)=>{
    try {
        const {email, password, task_id} = req.params;
        await db.task_create({email, password}, task_id);
        res.send({email, password});
    } catch (error) {
        res.send(error);
    }
});

app.put("/worker/:oldemail/:email/:password", async (req,res)=>{
    try {
        const {oldemail, email, password} = req.params;
        db.worker_update({email, password}, oldemail);
        res.send({email, password});
    } catch (error) {
        res.send(error);
    }
});

app.delete("/worker/:email", async (req,res)=>{
    try {
        const {email} = req.params;
        db.worker_delete(email);
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
});