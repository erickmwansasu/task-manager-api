const express = require('express');
const router = express.Router()

const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')

router.get('/admin-dashboard', adminController.adminDashboard)
router.get('/all-users', adminController.getAllUsers)
router.get('/user-suggestions', adminController.additionalFeatures)
router.get('/topics', adminController.topics)
router.get('/logout', authController.handleUserLogout)

module.exports = router