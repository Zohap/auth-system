require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

const app = express();
const User = require("./models/User");

// ================= DATABASE =================

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main()
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// ================= USER SCHEMA =================




// ================= APP CONFIG =================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


// ================= SESSION =================

const sessionOptions = {

    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,

        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,

        maxAge: 1000 * 60 * 60 * 24 * 7,

    },

};

app.use(session(sessionOptions));

app.use(flash());


// ================= PASSPORT =================

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


// ================= LOCALS =================

app.use((req, res, next) => {

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.currUser = req.user;

    next();

});


// ================= MIDDLEWARE =================

function isLoggedIn(req, res, next) {

    if (!req.isAuthenticated()) {

        req.flash("error", "Please Login First!");

        return res.redirect("/login");

    }

    next();

}
// ================= HOME =================

app.get("/",(req,res)=>{

    if(req.isAuthenticated()){

        return res.redirect("/dashboard");

    }

    res.redirect("/login");

});


// ================= SIGNUP =================

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {

            if (err) {
                return res.send(err);
            }

            req.flash("success", "Welcome!");

            res.redirect("/dashboard");

        });

    }

   catch(err){

    console.log(err);

    req.flash("error",err.message);

    return res.redirect("/signup");

}

});


// ================= LOGIN =================

app.get("/login", (req, res) => {

    res.render("login");

});


app.post(
    "/login",

    passport.authenticate("local", {

        failureRedirect: "/login",

        failureFlash: true,

    }),

    (req, res) => {

        req.flash("success", "Welcome Back!");

        res.redirect("/dashboard");

    }

);


// ================= DASHBOARD =================

app.get("/dashboard", isLoggedIn, (req, res) => {

    res.render("dashboard");

});


// ================= LOGOUT =================

app.get("/logout", (req, res, next) => {

    req.logout(function (err) {

        if (err) {

            return next(err);

        }

        req.flash("success", "Logged Out Successfully");

        res.redirect("/login");

    });

});


// ================= SERVER =================

app.listen(8080, () => {

    console.log("Server Started On Port 8080");

});