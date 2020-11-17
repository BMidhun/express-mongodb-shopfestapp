const express = require('express');
const Router = express.Router();
const Product = require('../controllers/products');
const AuthMiddleware = require('./authmiddleware');
const { productValidateSchema } = require('./validator.middleware');

Router.use('/add-product', AuthMiddleware, Product.addProductPage);
Router.use('/admin', AuthMiddleware, Product.adminProductPage);

Router.post('/postproduct', productValidateSchema, AuthMiddleware, Product.registerProduct);
Router.post('/editproduct', productValidateSchema, AuthMiddleware, Product.updateProduct);
Router.post('/delete-product', AuthMiddleware, Product.deleteProduct);

Router.delete('/delete-product/:id', AuthMiddleware, Product.deleteProductById)

Router.get('/edit-product/:id', AuthMiddleware, Product.addProductPage);
Router.get('/:id', Product.getProductById);





module.exports = Router;