const { fetchEmailTransport } = require('../loaders/emailservice');
const user = require('../services/user');
const parseEmail = require('../utils/parseEmail');
const path = require('path');
const rootDir = require('../utils/path');
const fs = require('fs');
const pug = require('pug')


exports.renderLoginPage = async (req, res, next) => {

    try {
        let message = req.flash('error');
        message = message.length ? message[0] : null;
        if (req.session.isLoggedIn)
            res.redirect('/')
        res.status(422).render('auth/login', { pageTitle: 'Login', message })
    } catch (error) { return false }

}


exports.postLogin = async (req, res, next) => {

    try {


        if (req.error && req.error.length) {
            return res.status(422).render('auth/login', { pageTitle: 'Login', message: req.error, data: req.body })
        }
        const userdata = await user.verifyUser(req.body.email, req.body.password);
        if (userdata) {
            req.session.isLoggedIn = true
            req.session.user = userdata;
            req.session.save((err) => {
                console.log(err);
            });
            res.redirect('/');
        }
        else {
            return res.status(422).render('auth/login', { pageTitle: 'Login', message: 'You have either entered a wrong email address or password!', data: req.body })
        }

    } catch (err) {
        console.log(err)
        res.redirect('/error');
    }

}

exports.postLogout = async (req, res, next) => {
    try {
        req.session.destroy((response) => {
            res.redirect('/')
        })
    } catch (error) { res.redirect('/error') }
}


exports.renderSignupPage = async (req, res, next) => {
    try {
        let message = req.flash('error');
        message = message.length ? message[0] : null;
        if (req.session.isLoggedIn)
            res.redirect('/')
        res.render('auth/signup', { pageTitle: 'SignUp', message })
    } catch (error) { res.redirect('/error') }
}

exports.postSignUp = async (req, res, next) => {
    try {

        if (req.error && req.error.length) {
            return res.render('auth/signup', { pageTitle: 'SignUp', message: req.error, data: req.body })
        }
        const result = await user.registerUser(req);
        if (result && result.success) {
            const html = pug.compileFile(path.join(rootDir, 'emailtemplates', 'welcome.pug'))
            const response = parseEmail({
                from: 'fromemail@gmail.com',
                to: 'tomail@gmail.com',
                subject: 'Welcome to ShopFest!',
                html: html({ username: 'Midhun Baby' })
            })
            response ? res.redirect('/auth/login') : res.redirect('/err');
        }


        else if (result && result.message) {
            req.flash('error', result.message);
            res.redirect('/auth/signup')
        }
        else
            res.redirect('/error')


    } catch (error) { console.log(error); res.redirect('/error') }
}
