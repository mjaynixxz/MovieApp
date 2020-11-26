const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const Validator = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const isAdmin = require('../middleware/admin');
const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();



router.delete('/:id', [auth, validateObjectId], asyncMiddleware(async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return req.status(400).send('Invalid ID');
    res.send(customer);
}));

router.put('/:id', [auth, Validator(validate), validateObjectId], asyncMiddleware(async (req, res) => {
   const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    if (!customer) return res.status(400).send('Invalid request');
    res.send(customer);

}));

router.post('/', [auth, Validator(validate)], asyncMiddleware(async (req, res) => {

    let customer = new Customer ({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    // if (!customer) return res.status(400).send('Invalid request');
    await customer.save();
    res.send(customer);
}));

router.get('/:id',[auth, validateObjectId], asyncMiddleware(async(req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Id not found');
    res.send(customer);
}));

router.get('/', asyncMiddleware(async (req, res) => {
    const customer = await Customer.find().sort('name');
    if (!customer) return res.status(400).send('Invalid input');
    res.send(customer);
}));




module.exports = router;