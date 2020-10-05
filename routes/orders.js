const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
//const crypto = require('crypto');

/* GET ALL ORDERS */
// noinspection JSUnresolvedFunction
router.get('/', (req, res) => {

    // noinspection JSCheckFunctionSignatures
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'u.username'])
        .sort({id: 1})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({message: "No orders found"});
            }
        }).catch(err => console.log(err));
});

/* Get Single Order */
// noinspection JSUnresolvedFunction
router.get('/:id', (req, res) => {
    const orderId = req.params.id;

    // noinspection JSCheckFunctionSignatures
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => console.log(err));
});

/* PLACE A NEW ORDER */
// noinspection JSUnresolvedFunction
router.post('/new', (req, res) => {

   let {userId, products} = req.body;

   if (userId !== null && userId > 0 && !isNaN(userId))
   {
       database.table('orders')
           .insert({
               user_id: userId
           }).then(newOrderId => {

           if(newOrderId > 0){
               products.forEach(async (p) => {

                   // noinspection JSCheckFunctionSignatures
                   let data = await database.table("products").filter({id: p.id}).withFields(['quantity']).get();

                   let inCart = p.incart;

               //  Deduct the number of pieces ordered from the quantity column in database
                   if(data.quantity > 0){
                       data.quantity = data.quantity - inCart;

                       if(data.quantity < 0){
                           data.quantity = 0;
                       }

                   } else {
                       data.quantity = 0;
                   }

               //  Insert order detail w.r.t the newly generated order ID
                   database.table('orders_details')
                       .insert({
                           order_id: newOrderId,
                           product_id: p.id,
                           quantity: inCart
                       }).then(newId => {
                           // noinspection JSUnusedLocalSymbols
                       database.table('products')
                               .filter({id: p.id})
                               .update({
                                   quantity: data.quantity
                               }).then(successNum =>{}).catch(err => console.log(err));
                   }).catch(err => console.log(err));
               });

           } else {
               res.json({message: 'new order failed while adding order details', success: false});
           }
           res.json({
               message: `Order successfully placed with order id ${newOrderId}`,
               success: true,
               order_id: newOrderId,
               products: products
           })

       }).catch(err => console.log(err));
   } else {
       res.json({message: 'New order failed', success: false});
   }


});

// FAKE PAYMENT GATEWAY CALL
// noinspection JSUnresolvedFunction
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000);
});

module.exports = router;
