//jshint esversion:6
require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const encrytion = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.set("useCreateIndex", true);
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true } 
});


userSchema.plugin(encrytion, { secret: process.env.secret, encryptFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    // res.send(newUser);
    newUser.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.render("secrets");
        }
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", function(req, res) {
    
    User.findOne({email: req.body.username}, function(err, foundUser) {

        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render("secrets");
                } else {
                    res.render("login");
                }
            } else {
                res.render("home");
            }
        }
    });
});

app.get("/secrets", function(req, res) {
    res.render("secrets");
});

app.get("/logout", function(req, res) {
    res.render("home");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});