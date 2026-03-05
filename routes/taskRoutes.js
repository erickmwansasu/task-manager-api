const express = require('express');
const router = express.Router()

const taskController = require('../controllers/taskController')

router.post('/createTask', taskController.createTask)
router.get('/getTasks', taskController.getTasks)
router.get('/getTaskById/:id', taskController.getTaskById)
router.delete('/deleteTask/:id', taskController.deleteTask)

module.exports = router