const winston = require('winston');
require('winston-mongodb');


module.exports = function () {
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true, handleExceptions: true, handleRejections: true }));
    winston.add(new winston.transports.File({ filename: 'errorlog.log', handleExceptions: true, handleRejections: true }));
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/dbmovies', level: 'info' }));

}