const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middlewares/authenticateUser.middlewares')
const { signUp , login , logout} = require('../controllers/auth.controllers');

router.route('/signup').post(signUp);
router.route('/login').get(login);
router.route('/logout').post(authenticateUser,logout);

module.exports = router;