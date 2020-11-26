const asyncMiddleware = require('../middleware/async');
const Validator = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const isAdmin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.delete('/:id', [auth, isAdmin, validateObjectId], asyncMiddleware(async (req, res) => {
  
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Id not found');
    res.send(genre);
}));


router.put('/:id', [auth, Validator(validate), isAdmin, validateObjectId], asyncMiddleware(async(req, res) => {
  
  const genre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, { new: true });
  if (!genre) return res.status(404).send('Invalid ID');
  res.send(genre);

}));

router.post('/', [auth, Validator(validate), isAdmin, validateObjectId], asyncMiddleware(async(req, res) => {

  let genre = new Genre ({ genre: req.body.genre });
 await genre.save();
  res.send(genre);
}));


router.get('/:id', validateObjectId, asyncMiddleware(async(req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(400).send('Invalid ID');
  res.send(genre);

}));

router.get('/', asyncMiddleware(async(req, res) => {
  
  const genre = await Genre.find().sort('genre');

  if (!genre) return res.status(404).send('Bad request, Please check url');
  res.send(genre);

}));



module.exports = router;
