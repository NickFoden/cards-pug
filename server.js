const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', function(req, res){
	res.render('index')
});

app.listen(8080, function(){
	console.log('Server started on port 8080...')
});