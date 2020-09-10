const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie (movie) {
    const schema = Joi.object({ 
        genreId: Joi.objectId() .required(),
        title: Joi.string() .required() .min(1) .max(255),
        numberInStock: Joi.number() .min(0) .required(),
        dailyRentalRate: Joi.number() .min(0) .required()
        
    });

    return schema.validate(movie);
}


exports.validate = validateMovie;
exports.Movie = Movie;