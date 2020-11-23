const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const auth = require('../middleware/auth');
const {  Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);




router.delete('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send('Not found');
    res.send(rental);
});


router.put('/', auth, async (req, res) => {

try {
    const { error } = validate(req.body);
if (error) return res.status(404).send(error.details[0].message);

const customer = await Customer.findById(req.body.customerId);
if (!customer) return res.status(404).send('Customer with the given Id not found');

const movie = await Movie.findById(req.body.movieId);
if (!movie) return res.status(404).send('Movie with the gicen Id not found');


if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    const rental = Rental.findByIdAndUpdate(req.params.id, {
      customerId: req.body.customerId,
      movieId: req.body.movieId
    }, { new: true });


    res.send(rental);

}

catch (ex) {
    console.log(ex.toString());
}
});

router.post('/', auth, async (req, res) => {

try {
    const { error } = validate(req.body);
if (error) return res.status(404).send(error.details[0].message);

const customer = await Customer.findById(req.body.customerId);
if (!customer) return res.status(404).send('Customer with the given Id not found');

const movie = await Movie.findById(req.body.movieId);
if (!movie) return res.status(404).send('Movie with the gicen Id not found');


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

}

catch (ex) {
    console.log(ex.toString());
}
});


router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given id was not found');
    res.send(rental);
});

router.get('/', async (req, res) => {
   const rental = await Rental.find().sort('-dateOut');
   res.send(rental);
});



module.exports = router;