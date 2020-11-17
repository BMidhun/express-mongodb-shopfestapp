const express = require('express');
const Router = express.Router();

const shopController = require('../controllers/shop');
const AuthMiddleware = require('./authmiddleware');

Router.get('/', shopController.getProducts);

Router.get('/cart', AuthMiddleware, shopController.renderCart);

Router.get('/checkout', AuthMiddleware, shopController.renderCheckout)

Router.post('/addtocart', AuthMiddleware, shopController.addToCart);

Router.post('/delete-cartitem', AuthMiddleware, shopController.deleteCartItem);

Router.post('/create-order', AuthMiddleware, shopController.createOrder);

Router.get('/orders', AuthMiddleware, shopController.displayOrder);

Router.get('/getInvoice/:orderid', AuthMiddleware, shopController.getInvoice);


module.exports = Router;