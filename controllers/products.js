
const Product = require('../services/product');

const path = require('path');

const rootDir = require('../utils/path');

exports.getProductById = async (req, res, next) => {

    const product = await Product.getProductById(req, false);
    product ? res.render('product/product-detail', { pageTitle: 'Product', product })
        :
        res.sendFile(path.join(rootDir, 'views', '404.html'));

}

exports.addProductPage = async (req, res, next) => {
    try {


        const isEdit = Boolean(req.query.edit);
        if (!isEdit)
            return res.render('product/addproductform', { pageTitle: 'Add Products', path: '/product/add-product', isEdit });
        else {
            const product = await Product.getProductById(req, isEdit);
            product ? res.render('product/addproductform', { pageTitle: 'Edit Product', path: '/product/add-product', product, isEdit })
                : res.sendFile(path.join(rootDir, 'views', '404.html'));
        }

    } catch (error) {
        next(error);
    }

}

exports.registerProduct = async (req, res, next) => {
    if (req.error && req.error.length) {
        return res.render('product/addproductform', { pageTitle: 'Add Products', path: '/product/add-product', isEdit: false, FormError: true, product: req.body, message: req.error });
    }

    const response = await Product.postProduct(req);
    // response ? res.redirect('/shop') : res.redirect('/product/add-product');
    response ? res.redirect('/shop') : res.sendFile(path.join(rootDir, 'views', '404.html'));
}


exports.adminProductPage = async (req, res, next) => {

    const result = await Product.getAllProducts(req, true);
    result ? res.render('shop/product-list', { ...result, pageTitle: 'Shop Now!', path: '/product/admin', isAdmin: true })
        :
        res.sendFile(path.join(rootDir, 'views', '404.html'));
}


exports.updateProduct = async (req, res, next) => {
    if (req.error) {
        return res.render('product/addproductform', {
            pageTitle: 'Edit Product', path: '/product/add-product', product: { ...req.body, _id: req.body.productid },
            isEdit: true, FormError: true, message: req.error
        })
    }
    const response = await Product.updateProduct(req);
    response ? res.redirect('/product/admin')
        : res.sendFile(path.join(rootDir, 'views', '404.html'));
}

exports.deleteProduct = async (req, res, next) => {
    const response = await Product.deleteProduct(req);
    response ? res.redirect('/product/admin')
        : res.sendFile(path.join(rootDir, 'views', '404.html'));
}


exports.deleteProductById = async (req, res, next) => {
    const response = await Product.deleteProduct(req);
    response ? res.json({ success: true }) : res.json({ success: false })
}




