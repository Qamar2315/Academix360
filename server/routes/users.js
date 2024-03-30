const express = require('express');
const { validateRegister, validateLogin } = require('../middlewares/schemaValidator');
const { registerUser, loginUser, changePassword, updateProfile, getProfile } = require('../controllers/users');
const { isLogin } = require('../middlewares/isLogin');
const { isProfileAuthor } = require('../middlewares/authorization');
const router = express.Router();

router.route('/signup')
    .post(validateRegister, registerUser)

router.route('/login')
    .post(validateLogin, loginUser)

router.route('/:userId')
    .get(isLogin, getProfile)
    .put(isLogin, isProfileAuthor, updateProfile)

router.route('/:userId/update-password')
    .put(isLogin, isProfileAuthor, changePassword)

module.exports = router;