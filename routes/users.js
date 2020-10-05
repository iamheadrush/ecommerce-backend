const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

// GET users listing.
// noinspection JSUnresolvedFunction
router.get('/', function (req, res) {
    // noinspection JSCheckFunctionSignatures
    database.table('users')
        .withFields([ 'phone' , 'address' , 'email', 'fname', 'lname', 'id' ])
        .getAll().then((list) => {
        if (list.length > 0) {
            res.json({users: list});
        } else {
            res.json({message: 'NO USER FOUND'});
        }
    }).catch(err => res.json(err));
});

// GET ONE USER MATCHING ID
// noinspection JSUnresolvedFunction
router.get('/:userId', (req, res) => {
    let userId = req.params.userId;
    // noinspection JSCheckFunctionSignatures
    database.table('users').filter({id: userId})
        .withFields([ 'phone' , 'address' , 'email','fname', 'lname', 'id' ])
        .get().then(user => {
        if (user) {
            res.json({user});
        } else {
            res.json({message: `NO USER FOUND WITH ID : ${userId}`});
        }
    }).catch(err => res.json(err) );
});

// UPDATE USER DATA or UPLOAD USER DATA
// noinspection JSUnresolvedFunction
router.patch('/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    // noinspection JSCheckFunctionSignatures
    let user = await database.table('users').filter({id: userId}).get();
    if (user) {
        let userPhone = req.body.phone;
        let userAddress = req.body.address;
        let userEmail = req.body.email;
        let userFirstName = req.body.fname;
        let userLastName = req.body.lname;

        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        // noinspection JSUnusedLocalSymbols
        database.table('users').filter({id: userId}).update({
            phone: userPhone !== undefined ? userPhone : user.phone,
            address: userAddress !== undefined ? userAddress : user.address,
            email: userEmail !== undefined ? userEmail : user.email,
            fname: userFirstName !== undefined ? userFirstName : user.fname,
            lname: userLastName !== undefined ? userLastName : user.lname,
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});

module.exports = router;
