const asyncMiddleware = require('../middleware/async')
const auth = require('../middleware/auth');
const Validator = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const isAdmin = require('../middleware/admin');
const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const {  Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);




router.delete('/:id', [auth, isAdmin, validateObjectId] , asyncMiddleware(async(req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send('Not found');
    res.send(rental);
}));


router.put('/:id', [auth, Validator(validate), isAdmin, validateObjectId], asyncMiddleware(async (req, res) => {

const customer = await Customer.findById(req.body.customerId);
if (!customer) return res.status(400).send('Invalid Customer');

const movie = await Movie.findById(req.body.movieId);
if (!movie) return res.status(400).send('Invalid Movie');


if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    const rental = Rental.findByIdAndUpdate(req.params.id, {
      customerId: req.body.customerId,
      movieId: req.body.movieId
    }, { new: true });


    res.send(rental);


}));

router.post('/', [auth, isAdmin, validateObjectId], asyncMiddleware(async(req, res) => {

const customer = await Customer.findById(req.body.customerId);
if (!customer) return res.status(400).send('Invalid Customer');

const movie = await Movie.findById(req.body.movieId);
if (!movie) return res.status(400).send('Invalid Customer');


if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone 
        },

        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    
    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: {numberInStock: -1}
        })
        .run();
    res.send(rental);
    }

    catch (ex) {
        return res.status(500).send('Something went wrong');
    }
}))

router.get('/:id', [auth, isAdmin, validateObjectId], asyncMiddleware(async(req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given id was not found');
    res.send(rental);
}));

router.get('/', asyncMiddleware(async(req, res) => {
   const rental = await Rental.find().sort('-dateOut');
   res.send(rental);
}));



module.exports = router;