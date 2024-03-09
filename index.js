const express = require("express");
const db = require("./database");

const app = express();
require("pug");
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const session = require("express-session");

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));
app.get("/login", (req, res)=>{
    res.render("login");
})
app.post("/login", async (req,res)=>{
    console.log(await db.user(req.body.email))
    
    let worker = await db.worker(req.body.email)
    let user = await db.user(req.body.email)
    if(worker.length && worker[0].password == req.body.password){
        req.session.user = {loggedin:true, user_name:req.body.email, user_role:"worker"}
        return res.redirect("/");
    } 
    
    else if(user.length && user[0].password == req.body.password){
        req.session.user = {loggedin:true, user_name:req.body.email, user_role:"user"}
        return res.redirect("/");
    }

    //res.send("Use correct email and password to log in");
    //console.log(worker);
    //console.log(user);
    else{
        res.render("login");
    }
   
})

const PORT = 1234;
app.listen(PORT,err=>{
    if(err) return console.log(err);
    console.log("http://localhost:"+PORT);
});

app.get("/",async (req,res)=>{
    if(!req.session.user){
        return res.render("login");
    }
    //console.log(req.session.user);
    //console.log(req.session.user.user_name);
    let houses = await db.houses(req.session.user.user_name);
    //console.log(houses);
    res.render("houses", {houses});
});

//const user = "exampleUser@gmail.com";



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
/* /:address/:room/:type/:sqm */
app.post("/house", async (req,res)=>{
    try {
        
        const {address, room, type, sqm} = req.body;
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






app.get("/createTask", (req,res)=>{res.render("createTask")});

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

app.post("/task", async (req,res)=>{
    try {
        const {name, desc, house} = req.body;
        await db.task_create({name, desc}, house);
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

app.post("/worker", async (req,res)=>{
    try {
        const {email, password, task_id} = req.body;
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