const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();
const {PORT, DATABASE_URL} = require('./config.js');

const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;
const {User} = require('./models.js');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const {router: routerCards} = require('./routerCards');
const {router: routerUsers} = require('./routerUsers');

app.use('/cards/', routerCards);
app.use('/users/', routerUsers);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		console.log("Please Log in")
		res.redirect('login');
	}
}

//Routes
app.get('/', function(req, res){
	res.render('index')
});

app.get('/index', function(req, res){
	res.render('index')
});

app.get('/login', function(req, res){
	res.render('login')
});

app.get('/logout', function(req, res){
	req.logout();
	console.log("You Are Logged Out")
	res.redirect('index')
});

app.get('/new-card', ensureAuthenticated, function(req, res){
	console.log(req.user)
	res.render('new-card')
});

app.get('/sign-up', function(req, res){
	res.render('sign-up')
});

app.get('/start', function(req, res){
	res.render('start')
});

app.get('/summary', function(req, res){
	res.render('summary')
});

app.post('*', function(req, res, next){
  console.log("just the req", req.user);
  res.locals.user = req.user || null;
  next();
});

app.post('/', (req, res) => {
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

//Server
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT){
	return new Promise((resolve, reject) => {
    	mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
	      	})
	      	.on('error', err => {
	        	mongoose.disconnect();
	        	reject(err);
      		});
    	});
  	});
}

function stopServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, stopServer};