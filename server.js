const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('/', function(req, res){
	res.render('index')
});

app.get('/login', function(req, res){
	res.render('login')
});

app.get('/new-card', function(req, res){
	res.render('new-card')
});

app.get('/sign-up', function(req, res){
	res.render('sign-up')
});

app.listen(8080, function(){
	console.log('Server started on port 8080...')
});