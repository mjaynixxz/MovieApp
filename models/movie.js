const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie (movie) {
    const schema = Joi.object({ 
        genreId: Joi.objectId() .required(),
        title: Joi.string() .required() .min(5) .max(255),
        numberInStock: Joi.number() .min(0) .max(255) .required(),
        dailyRentalRate: Joi.number() .min(0) .max(255) .required()
        
    });

    return schema.validate(movie);
}


exports.validate = validateMovie;
exports.Movie = Movie;