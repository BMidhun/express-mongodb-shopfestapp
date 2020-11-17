const { PageNotFound } = require('../controllers/error');
const product = require('../routes/product');
const shop = require('../routes/shop');
const auth = require('../routes/auth');
const user = require('../routes/user');

const path = require('path');

const rootDir = require('../utils/path')

module.exports = (app) => {
    app.use('/auth', auth)
    app.use('/product', product); // implies request api route will have the following format /product/
    app.use('/shop', shop); // implies request api route will have the following format /shop/   
    app.use('/user', user)
    app.use(PageNotFound); //  If user enters a non-existing page in browser URL



    app.use((error, req, res, next) => {
        console.log(error)
        res.sendFile(path.join(rootDir, 'views', 'no-internet.html'));
    })

    app.use((err, req, res, next) => {
        if (err.message.toLowerCase().includes('image')) {
            req.error = err.message
            next();
        }

        next();
    });

    return app;
}