const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');
const {User, validate, generateAuth} = require('../models/user');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const validator = require('../middleware/validate');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, asyncMiddleware(async(req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
}));

router.post('/', validator(validate), asyncMiddleware(async(req, res) => {

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');
    
    user = new User(_.pick(req.body, ['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    
    await user.save();
    

    const token = user.generateAuth();


    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    
    


}));

module.exports = router;


