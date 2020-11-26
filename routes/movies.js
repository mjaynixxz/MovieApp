const asyncMiddleware = require('../middleware/async');
const Validator = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Movie, validate} = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
}));

router.post('/', [auth, Validator(validate), isAdmin], asyncMiddleware(async (req, res) => {

const genre = await Genre.findById(req.body.genreId);
if (!genre) return res.status(400).send('Invalid genre');

let movie = new Movie({
  title: req.body.title,
  genre: {
    _id: genre._id,
    genre: genre.genre
  },
  numberInStock: req.body.numberInStock,
  dailyRentalRate: req.body.dailyRentalRate
});

await movie.save();

res.send(movie);

  
}));

router.put('/:id', [auth, Validator(validate), isAdmin, validateObjectId], asyncMiddleware(async (req, res) => {
  
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        genre: genre.genre
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(movie);
  

  
}));

router.delete('/:id', [auth, isAdmin, validateObjectId], asyncMiddleware(async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
}));

router.get('/:id', validateObjectId, asyncMiddleware(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
}));

module.exports = router; 