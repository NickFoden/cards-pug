require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const Strategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const SECRET_KEY = require("./config.js");

mongoose.Promise = global.Promise;
const { User } = require("./models.js");
// const cookieParser = require("cookie-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
// router.use(cookieParser());
router.use(
  require("express-session")({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false
  })
);

router.post("/login", function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/summary",
    failureRedirect: "/sign-up"
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("index");
});

module.exports = { router };

//End
