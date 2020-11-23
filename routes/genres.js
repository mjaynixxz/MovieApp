const mongoose = require('mongoose');
const Joi = require('joi');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.delete('/:id', auth, async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Id not found');
    res.send(genre);
  }
  catch (err) {
    for (i in err.error) {
      console.log(err.error[i]);
    }
  }
});


router.put('/:id', auth, async (req, res) => {
   const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, { new: true });
  if (!genre) return res.status(404).send('Invalid ID');
  res.send(genre);

});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre ({ genre: req.body.genre });
  genre = await genre.save();
  res.send(genre);
});


router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(400).send('Invalid ID');
  res.send(genre);

})

router.get('/', async (req, res) => {
  throw new Error('Something happend');
  const genre = await Genre.find().sort('genre');

  if (!genre) return res.status(404).send('Bad request, Please check url');
  res.send(genre);

});



module.exports = router;
