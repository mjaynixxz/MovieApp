require('express-async-errors');
const winston = require('winston');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging');
require('./startup/config')();


const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening to port ${port}...`));