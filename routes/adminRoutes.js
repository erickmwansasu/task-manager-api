const express = require('express');
const router = express.Router()

const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const taskController = require('../controllers/taskController')

const authorize = require('../middleware/authorization');
const authenticate = require('../middleware/authentication');

router.get('/admin-dashboard', authenticate, adminController.adminDashboard)
router.get('/all-users', adminController.getAllUsers)
router.get('/user-suggestions', adminController.additionalFeatures)
router.get('/all-tasks', authenticate, taskController.allTasks)
router.get('/topics', adminController.topics)
router.get('/logout', authController.handleUserLogout)

module.exports = router