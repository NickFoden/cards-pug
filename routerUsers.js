const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;
const {User} = require('./models.js');
const cookieParser = require('cookie-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }
  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }
  let {username, password} = req.body;
  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }
  username = username.trim();
  if (username=== '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }
  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }
  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }
  password = password.trim();
  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }
  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          name: 'AuthenticationError',
          message: 'username already taken'
        });
      }
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      console.log(err);
      if (err.name === 'AuthenticationError') {
        return res.status(422).json({message: err.message});
      }
      res.status(500).json({message: 'Internal server BIG error'})
    });
});

passport.use(new Strategy(
  function(username, password, cb) {
    let query = {username:username};
    User.findOne(query, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false, {message: "incorrect username"}); }
      if (!user.validatePassword(password)) { return cb(null, false, {message: "incorrect password"}); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

/*router.get('/login', 
  function(req, res){
    res.sendFile(path.join(__dirname + '/public/login.html'));
  });*/

router.post('/login', function(req, res, next) {
  passport.authenticate('local', { 
    successRedirect: '/summary', 
    failureRedirect: '/sign-up'
  })(req, res, next);
});

/*router.post('/login', 
  passport.authenticate('local'),
    function(req, res) {
      res.redirect('/');
});*/


router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = {router};

//End