const express = require("express");
const db = require("./database");
const uniqid = require("uniqid");
const app = express();
require("pug");
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//require("dotenv").config();
const session = require("express-session");
const bcrypt = require("bcrypt");

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
    //console.log(await db.user(req.body.email))
    
    let worker = await db.worker(req.body.email)
    let user = await db.user(req.body.email)
    //console.log(await bcrypt.compare(req.body.password.toString(), user[0].password))
    if(worker.length && await bcrypt.compare(req.body.password.toString(), worker[0].password)){
        req.session.user = {loggedin:true, user_name:req.body.email, user_role:"worker"}
        return res.redirect("/");
    }
    
     
    
    else if(user.length && await bcrypt.compare(req.body.password.toString(), user[0].password)){
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
    const houses = await db.houses(req.session.user.user_name);
    //console.log(houses);
    res.render("houses", {houses});
});

//const user = "exampleUser@gmail.com";

app.get("/createUser/:email/:password", async (req,res)=>{
    try {
        let {email, password} = req.params;
        password = await bcrypt.hash(password, 12);
        await db.user_create({email, password});
        res.redirect("/")
    } catch (error) {
        res.send(error);
    }
})

app.get("/createHouse", (req,res)=>{res.render("createHouse")});

app.get("/house", async (req,res)=>{
    try {
        const house = req.body;
        res.render("/house", {house});
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
        //console.log(req.body);
        const {address, room, type, sqm} = req.body;
        await db.house_create({address, room, type, sqm}, req.session.user.user_name);
        const house = {address:address, room:room, type:type, square_meters:sqm}
        
        //fixa render för ett hus här så den lägger till iställe för att ersätter
        res.render("house", {house})
        //res.redirect("/");
    } catch (error) {
        res.send(error);
    }
});

app.get("/editHouse/:address", async (req,res)=>{
    try {
        const {address} = req.params;
        const house = await db.house(address, req.session.user.user_name);
        console.log(house);
        res.render("editHouse", {house});
    } catch (error) {
        res.send(error);
    }
});

app.post("/editHouse", async (req,res)=>{
    try {
        const {oldaddress, address, room, type, sqm} = req.body;
        db.house_update({address, room, type, sqm}, oldaddress);
        const house = {address:address, room:room, type:type, square_meters:sqm}
        res.render("house",{house});
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

app.get("/tasks/:house", async (req,res)=>{
    try {
        const {house} = req.params;
        //console.log(house);
        //res.send(await db.tasks(house));
        const tasks = await db.tasks(house);
        res.render("tasks", {tasks, house:house});
    } catch (error) {
        res.send(error);
    }
});

app.get("/task/:id/:house", async (req,res)=>{
    try {
        const {id, house} = req.params;
        res.send(await db.task(id, house));
    } catch (error) {
        res.send(error);
    }
});

app.post("/task", async (req,res)=>{
    try {
        const {name, desc, house, worker} = req.body;
        const id = uniqid("g");
        await db.task_create({id, name, desc, worker}, house);
        const task = {id:id, name:name, description:desc, house:house, worker:worker}
        res.render("task", {task})
    } catch (error) {
        res.send(error);
    }
});
app.get("/editTask/:id/:house", async (req,res)=>{
    try {
        const {id, house} = req.params;
        const task = await db.task(id,house);
        
        //console.log(task[0]);
        res.render("editTask", {task});
    } catch (error) {
        res.send(error);
    }
})
app.post("/editTask", async (req,res)=>{
    try {        
        const {id, house, name, desc, worker} = req.body;
        await db.task_update({name, desc,worker}, id);
        const task = {id, name, description:desc, worker, house}
        res.render("task", {task});
    } catch (error) {
        res.send(error);
    }
});

app.delete("/task/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        await db.task_delete(id);
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
});




app.get("/createWorker", (req, res)=>{
    res.render("createWorker");
});

app.get("/workers", async (req,res)=>{
    try {
        const workers = await db.workers(req.session.user.user_name)
        res.render("workers", {workers});
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
        let {email, password} = req.body;
        const id = uniqid("g");
        password = await bcrypt.hash(password, 12);
        await db.worker_create({id, email, password}, req.session.user.user_name);
        //res.send({email, password});
        res.render("worker", {email, id});
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

app.get("/editWorker/:email", async (req,res)=>{
    try {
        const {email} = req.params;
        
        //console.log(task[0]);
        res.render("editWorker", {email});
    } catch (error) {
        res.send(error);
    }
}); 

app.post("/editWorker", async (req,res)=>{
    try {
        let {email, password} = req.body;
        password = await bcrypt.hash(password, 12);
        await db.worker_update({email, password}, req.session.user.user_name);
        //res.render("worker", {email});
    } catch (error) {
        res.send(error);
    }
});

app.delete("/worker/:email", async (req,res)=>{
    try {
        const {email} = req.params;
        await db.worker_delete(email, req.session.user.user_name);
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
});