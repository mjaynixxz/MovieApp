const config = require('config');
const winston = require('winston');

module.exports = function () {
    if (!config.get('jwtSecret')) {
    throw new Error('FATAL ERROR: jwt token not defined');
    
}
}