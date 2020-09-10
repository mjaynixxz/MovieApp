const express = require('express');
const rental = require('../routes/rentals');
const genre = require('../routes/genres');
const customer = require('../routes/customers');
const movies = require('../routes/movies');
const user = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/rentals', rental);
    app.use('/api/genres', genre);
    app.use('/api/customers', customer);
    app.use('/api/movies', movies);
    app.use('/api/users', user);
    app.use('/api/auth', auth);
    app.use(error);
}