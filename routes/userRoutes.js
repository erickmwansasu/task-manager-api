const express = require('express');
const router = express.Router()

const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

router.get('/', authController.loginPage)
router.get('/login-page', authController.loginPage)
router.get('/register-page', authController.registerPage)
router.post('/user-registration', authController.handleUserRegistration)
router.post('/user-login', authController.handleUserLogin)
router.get('/user-home', userController.userHome)

module.exports = router