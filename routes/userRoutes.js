const express = require('express');
const router = express.Router()

const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const roles_list = require('../config/rolesList')

const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorization');

router.get('/', authController.loginPage)
router.get('/login-page', authController.loginPage)
router.get('/register-page', authController.registerPage)
router.post('/user-registration', authController.handleUserRegistration)
router.post('/user-login', authController.handleUserLogin)
router.get('/user-logout', authController.handleUserLogout)
router.get('/user-home', userController.userHome)
router.get('/user-profile', authenticate, authorize(roles_list.Admin), userController.userProfile)
router.get('/refresh', authenticate, authController.refreshToken)

module.exports = router