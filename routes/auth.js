const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth');
const { signUpValidateMiddleware, loginValidateMiddleware } = require('./validator.middleware');


router.get('/login', authController.renderLoginPage);

router.get('/signup', authController.renderSignupPage);

router.post('/signup', signUpValidateMiddleware, authController.postSignUp);

router.post('/login', loginValidateMiddleware, authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;