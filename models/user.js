const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuth = function () {
    const token = jwt.sign({id: this._id}, config.get('jwtSecret'));
    return token;
}

const User = mongoose.model('User', userSchema);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string() .min(5) .max(255) .required(),
        email: Joi.string() .min(5) .max(255) .required() .email(),
        password: Joi.string() .min(5) .max(255) .required()
    });

    return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User;
module.exports.generateAuth = this.generateAuth;