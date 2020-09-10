const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();



router.delete('/:id', auth, async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return req.status(400).send('Invalid ID');
    res.send(customer);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    if (!customer) return res.status(400).send('Invalid request');
    res.send(customer);

});

router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let customer = new Customer ({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    // if (!customer) return res.status(400).send('Invalid request');
    customer = await customer.save();
    res.send(customer);
});

router.get('/:id', async(req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Id not found');
    res.send(customer);
});

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    if (!customer) return res.status(400).send('Invalid input');
    res.send(customer);
});




module.exports = router;