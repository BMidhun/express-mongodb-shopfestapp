const express = require('express');

const router = express.Router();

const userController = require('../controllers/user')
const authMiddleware = require('./authmiddleware');
const { editProfileValidate } = require('./validator.middleware');

router.get('/profile', authMiddleware, userController.getUserProfile);

router.get('/edit-profile', authMiddleware, userController.renderEditProfile);

router.post('/reset-password', authMiddleware, userController.resetPassword);

router.post('/post-editprofile', editProfileValidate, authMiddleware, userController.postEditProfile);

router.get('/reset-password/:token', authMiddleware, userController.renderResetPassword);

router.post('/changePassword', authMiddleware, userController.changePassword)


module.exports = router;