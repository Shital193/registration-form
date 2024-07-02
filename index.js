const express =require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv =require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const Username = process.env.mongodbusername;
const Password = process.env.mongodbpassword;

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

mongoose.connect(`mongodb+srv://${Username}:${Password}@cluster0.pvlbsey.mongodb.net/Registrations`, {});

const RegistrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration",RegistrationSchema);

app.get('/', (req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
});

app.post("/Register", async (req,res)=>{
    try{
        const {name, email, password}= req.body;
        const presentUser = await Registration.findOne({email: email});
        if(presentUser){
            console.log("User already present");
            res.redirect("/fail");
        }
        else{
            const RegistrationData = new Registration({
                name, email, password
            });
            await RegistrationData.save();
            console.log("Registration Done");
            res.redirect("/pass");
        }
    }
    catch(error){
        console.log(error);
        res.redirect("/fail");
    }
});

app.get("/pass", (req,res)=>{
    res.sendFile(__dirname+"/pages/pass.html");
});

app.get("/fail", (req,res)=>{
    res.sendFile(__dirname+"/pages/fail.html");
});

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});
