const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
mongoose.Promise = global.Promise;
const {Card} = require('./models.js');
const {PORT, DATABASE_URL} = require('./config.js');

const routerCards = router;

router.use(jsonParser);

router.get('/', (req, res) => {
  Card
    .find()
    .exec()
    .then(cards => {
      res.status(200).json(cards), {user: req.user};
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', (req, res) => {
	console.log(req);
	console.log(res);
	const requiredFields = ['question', 'answer', 'reference'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
    }
  }
	Card
    .create({
      question: req.body.question,
      answer: req.body.answer,
      reference: req.body.reference})
    .then(
      card => res.status(201).json(card))    
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.delete('/:id', (req, res) => {
  Card
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(card => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {Card};
module.exports = {router};
//End