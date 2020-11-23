const _ = require('lodash');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {User, generateAuth, userSchema} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    console.log(user);
    // res.send(user);
});

router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuth();

    res.header('x-auth-token', token).send('Logged in successfully');

});


function validate(req) {
const schema = Joi.object({
    email: Joi.string() .min(5) .max(255) .required() .email(),
    password: Joi.string() .min(5) .max(255) .required()
});
    return schema.validate(req); 
}

module.exports = router;

