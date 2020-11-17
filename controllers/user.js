const userService = require('../services/user');
const pug = require('pug');
const parseEmail = require('../utils/parseEmail');

exports.getUserProfile = async (req, res, next) => {
    let message = req.flash('message');
    message = message.length ? message[0] : null;
    console.log(req.user.toObject())
    res.render('profile/profile', { pageTitle: 'Profile', userdata: req.user.toObject(), message });
}

exports.resetPassword = async (req, res, next) => {
    try {

        const response = await userService.resetPassword(req);

        if (response) {
            parseEmail({
                to: req.user.email,
                from: 'admin@shopfest.com',
                subject: 'Reset Password',
                html: `<h1> Reset Password </h1>
                      <p> Please click on the following link to reset your password </p>
                      <p> http://localhost:3001/user/reset-password/${response}</p>
                      `
            });

            req.flash('message', "Please check your email, we have sent you a link to reset the password");
            res.redirect('/user/profile');
        }
        else {
            req.flash('message', 'Reset Password Failed! Try Again')
            res.redirect('/user/profile');
        }
    } catch (error) { res.redirect('/err') }
}


exports.renderResetPassword = async (req, res, next) => {

    try {

        let message = req.flash('error');
        message = message.length ? message[0] : null;
        const response = await userService.verifyUserToken(req);

        res.render('auth/resetpassword', { pageTitle: 'Reset Password', response, message, token: req.params.token });

    } catch (error) { res.redirect('/err') }

}

exports.changePassword = async (req, res, next) => {
    try {

        if (req.body.new_password !== req.body.cnew_password) {
            req.flash('error', 'Passwords does not match');
            res.redirect(`/reset-password/${req.body.token}`);
        }
        else {
            const response = await userService.changePassword(req);
            const message = response ? 'Password Changed Succesfully!' : 'Reset Password Failed!'
            req.flash('message', message);
            res.redirect('/user/profile')
        }


    } catch (error) { console.log(error); res.redirect('/err') }
}


exports.renderEditProfile = async (req, res, next) => {

    try {
        const user = await userService.findUserById(req.user._id);
        user ? res.render('profile/edit-profile', { pageTitle: 'Edit Profile', user })
            : res.status(404).redirect('/err')
    } catch (error) {
        res.status(404).redirect('/err')
    }
}

exports.postEditProfile = async (req, res, next) => {
    try {


        let imageUrl = '';

        if (req.file) {
            imageUrl = '/' + req.file.path
        }

        if (req.file === null) {
            return res.render('profile/edit-profile', { pageTitle: 'Edit Profile', user: { ...req.body, profilepic: null }, message: 'You have upload a wrong file. Please upload an image having png,jpg or jpeg as extension. Also the image must be less than 1mb' });
        }

        if (req.error && req.error.length) {
            return res.render('profile/edit-profile', { pageTitle: 'Edit Profile', user: { ...req.body, profilepic: req.file ? imageUrl : req.user.profilepic }, message: req.error });
        }
        const result = await userService.updateUser(req, imageUrl);
        result ? res.redirect('/user/profile') : res.status(404).redirect('/err')

    } catch (error) {
        console.log(error)
        res.status(404).redirect('/err')
    }
}