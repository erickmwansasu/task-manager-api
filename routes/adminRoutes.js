const express = require('express');
const router = express.Router()

const adminController = require('../controllers/adminController')

router.get('/getUsers', adminController.getUsers)
router.post('/createUser', adminController.createUser)
router.put('/updateUser/:id', adminController.updateUser)
router.delete('/deleteUser/:id', adminController.deleteUser)

module.exports = router