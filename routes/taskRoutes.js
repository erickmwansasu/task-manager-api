const express = require('express');
const router = express.Router()

const taskController = require('../controllers/taskController')

router.post('/createTask', taskController.createTask)
router.get('/getTasks', taskController.getTasks)
router.get('/getTaskById/:id', taskController.getTaskById)
router.patch('/:id/complete', taskController.markComplete)
router.patch('/:id/incomplete', taskController.markIncomplete)
router.get('/filterComplete', taskController.filterComplete)
router.get('/filterIncomplete', taskController.filterIncomplete)
router.delete('/deleteTask/:id', taskController.deleteTask)

module.exports = router