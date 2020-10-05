const express = require('express');
const {check, validationResult } = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');

// REGISTER ROUTE
// noinspection JSUnresolvedFunction
router.post('/', async (req, res) => {
    let phone = req.body.phone;
    let address = req.body.address;
    let email = req.body.email;
    let fname = req.body.fname;
    let lname = req.body.lname;

    helper.database.table('users').insert({
        phone: phone || null,
        address: address || null,
        email: email,
        lname: lname || null,
        fname: fname || null
    }).then(lastId => {
        if (lastId > 0) {
            res.status(201).json({message: 'Delivery Address Saved Successful.'});
        } else {
            res.status(501).json({message: 'Delivery Address Saving Failed.'});
        }
    }).catch(err => res.status(433).json({error: err}));

});

module.exports = router;
