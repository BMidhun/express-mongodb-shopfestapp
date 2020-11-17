const Product = require('../services/product');
const Cart = require('../services/cart');
const Order = require('../services/order')

const path = require('path');
const rootDir = require('../utils/path');
const fs = require('fs');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const PDFKIT = require('pdfkit');


exports.getProducts = async (req, res, next) => {
    const result = await Product.getAllProducts(req, false);
    result ? res.render('shop/product-list', { ...result, pageTitle: 'Shop Now!', path: '/shop/', isAdmin: false })
        : res.sendFile(path.join(rootDir, 'views', '404.html'));

}

exports.addToCart = async (req, res, next) => {

    const response = await Cart.addToCart(req);
    response ? res.redirect('/shop') : res.sendFile(path.join(rootDir, 'views', '404.html'));
}

exports.renderCart = async (req, res, next) => {

    const result = await Cart.displayCart(req);
    result ? res.render('cart/cart', { pageTitle: 'Your Cart', path: '/cart', totalamount: result.totalamount, cartitems: result.cartitems })
        : res.render('cart/cart', { pageTitle: 'Your Cart', path: '/cart', cartitems: [] })
}

exports.deleteCartItem = async (req, res, next) => {
    const result = await Cart.deleteCartItem(req);
    console.log(result)
    result ? res.redirect('/shop/cart') : res.sendFile(path.join(rootDir, 'views', '404.html'));
}


exports.createOrder = async (req, res, next) => {

    const result = await Order.registerOrder(req);
    result ? res.redirect('/shop/') : res.sendFile(path.join(rootDir, 'views', '404.html'));
}

exports.displayOrder = async (req, res, next) => {
    const result = await Order.displayOrder(req);
    result ? res.render('shop/order', { orders: result, path: '/shop/orders', pageTitle: 'Your Orders' })
        : res.sendFile(path.join(rootDir, 'views', '404.html'))
}


exports.getInvoice = async (req, res, next) => {

    // fs.readFile(path.join(rootDir, 'uploads', 'Toyota.pdf'), (err, data) => {
    //     if (err)
    //         res.status(404).redirect('/err');
    //     else {
    //         res.setHeader('Content-Type', 'application/pdf');
    //         res.setHeader('Content-Disposition', 'attachment; filename=' + 'Toyota.pdf')
    //         res.send(data);
    //     }

    // });

    // const fsstream = fs.createReadStream(path.join(rootDir, 'uploads', 'Toyota.pdf'));
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=' + 'Toyota.pdf')
    // fsstream.pipe(res)

    try {

        const order = await Order.getOrderofUser(req);

        if (!order)
            return res.redirect('/err');
        else {
            console.log(order)
            const filename = 'Shopfest_invoice' + order._id.toString() + '.pdf';
            const filepath = path.join(rootDir, 'invoices', filename);
            const pdfdoc = new PDFKIT({
                margins: {
                    top: 8,
                    bottom: 8,
                    left: 5,
                    right: 5
                }
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=' + filename)
            pdfdoc.pipe(fs.createWriteStream(filepath));
            pdfdoc.pipe(res);

            pdfdoc.fontSize(20).text('SHOPFEST', 0, 60, { align: 'center', lineGap: 10 });
            pdfdoc.text('Invoice #' + order._id.toString(), 100, 100, { underline: true, oblique: true, lineGap: 10 }).fontSize(16);
            pdfdoc.text('Product   ' + 'Qty   ' + '  Price')
            pdfdoc.text('---------------------------------------------------')

            order.products.forEach(product => {
                pdfdoc.fontSize(12).text(`${product.pname}          x${product.qty}               ${product.price}`);
            });
            pdfdoc.text('---------------------------------------------------')
            pdfdoc.text('Total :' + order.totalamount);
            pdfdoc.end();

        }

    } catch (error) {
        console.log(error)
        return res.redirect('/err');
    }

}



exports.renderCheckout = async (req, res, next) => {
    const result = await Cart.displayCart(req);
    result ? res.render('cart/checkout', { pageTitle: 'Checkout', path: '/cart', totalamount: result.totalamount, cartitems: result.cartitems })
        : res.sendFile(path.join(rootDir, 'views', '404.html'))
}





