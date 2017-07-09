const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config.js');

const {router: routerCards} = require('./routerCards');
const {router: routerUsers} = require('./routerUsers');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('*', function(req, res, next){
  console.log("just the req", req.user);
  res.locals.user = req.user || null;
  console.log("user locals", res.locals.user);
  next();
});

app.use('/cards/', routerCards);
app.use('/users/', routerUsers);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('/', function(req, res){
	res.render('index')
});

app.get('/login', function(req, res){
	res.render('login')
});

app.get('/logout', function(req, res){
	req.logout();
	console.log("You Are Logged Out")
	res.redirect('/index')
});

app.get('/new-card', function(req, res){
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