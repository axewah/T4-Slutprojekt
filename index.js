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