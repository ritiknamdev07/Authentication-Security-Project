//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({ 
    email:String,
    password:String
})


// userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register")
})



app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save(function(err){
            if(err){
                console.log(err)
            }else{
                res.render("secrets")
            }
        })
    });

   
})

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
    

    User.findOne({email:username},function(err,findEmail){
        if(err){
            res.render(err)
        }else{
            if(findEmail){
                bcrypt.compare(password, findEmail.password, function(err, result) {
                   if(result === true){
                    res.render("secrets")
                   }
                });
                 
                
                
            }
        }
    })
})







app.listen(3000, function(req,res){
    console.log("server is on now.")
});