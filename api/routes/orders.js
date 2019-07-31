const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const ordersControllers = require('../controllers/orders');

router.get('/',checkAuth, ordersControllers.orders_get_all );

router.post('/', checkAuth, (req, res, next)=>{
  Product.findById(req.body.productId)
  .then(product => {
    if (!product) {
      res.status(404).json({
        message : 'product not found'
      });
    } else {
      const order = new Order ({
      _id: mongoose.Types.ObjectId(),
      quantity : req.body.quantity,
      product: req.body.productId
    });
    return order.save();
  }
    })
      .then(result =>{
        console.log(result);
        res.status(200).json({
          message: 'order successfully added',
          createdOrder :{
            _id: result._id,
            quantity: result.quantity,
            product: result.product,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/'+ result._id
            }
          }
        });
      })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });


});

router.get('/:orderId', checkAuth, (req, res, next)=>{
    const id = req.params.orderId;
    Order.findById({_id: id})
    .populate('product')
    .select('quantity product _id')
    .exec()
    .then(result =>{
      if (result) {
        res.status(200).json({
          message: 'order details',
          order: result,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders'
          }
        });
      } else {
        res.status(404).json({
          message: 'No entry found on Orders'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:orderId', checkAuth, (req, res, next)=>{
  const id = req.params.orderId;
  Order.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'order successfully deleted',
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders'
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
