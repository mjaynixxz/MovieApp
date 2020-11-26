const mongoose = require('mongoose');
const winston = require('winston');


module.exports = function () {
    mongoose.connect(process.env.DB_HOST_DEV,  { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true  })
  .then(() => winston.info(`Connected to ${process.env.DB_HOST_DEV}`));
  
}