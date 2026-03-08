const Task = require('../models/task')
const mongoose = require('mongoose');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const getTasks = async (req, res) => {
   try {
    const roles = req.user.roles
    const userId = req.user.id

    const allowedRoles = [ 5150, 5050, 5005 ]
    const isAuthorized = roles.some(role => allowedRoles.includes(role))

    if (isAuthorized) {
        const allTasks = await Task.find().sort({ createdAt: -1 })

        if (!allTasks.length) {
            return res.status(200).json({
                success: true,
                message: 'You have no tasks yet'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Found all tasks',
            data: allTasks
        })
    }
   }
   catch (error) {
    console.error(error)
    return res.status(500).json({
        success: false,
        message: 'Internal server error!'
    })
   }
}

const createTask = async (req, res) => {
    try {
        const { id: userId, fullName, department, roles } = req.user
        const { taskName, description, dueDate } = req.body

        if (!fullName || !department) {
            return res.status(400).json({
                success: false,
                message: 'Complete your profile first!'
            })
        }

        if (!taskName || !description || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Fill all the fields'
            })
        }

        const allowedRoles = [ 5050, 5005 ]
        const isAuthorized = roles.some(role => allowedRoles.includes(role))

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create a task!'
            })
        }

        const taskExists = await Task.findOne({ taskName, userId })

        if (taskExists) {
            return res.status(409).json({
                success: false,
                message: 'You already have a task with this name!'
            })
        }

        const newTask = new Task({
            taskName: taskName,
            description: description,
            dueDate: dueDate,
            department: department,
            userId: userId,
            userName: fullName
        })
        await newTask.save()

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'An error has occured'
        })
    }
}

const getTaskById = async (req, res) => {
    try {
        const id = req.params.id
        const roles = req.user.roles

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            })
        }

        const task = await Task.findOne({ _id: id })

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'No task found'
            })
        }

        if (req.user.id !== task.userId.toString() && !roles.includes(5150)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this task',
            })
        }
        
        return res.status(200).json({
            success: true,
            message: 'Task found',
            data: task
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'An error has occured'
        })
    }
}

const markComplete = async (req, res) => {
    try {
        const taskId = req.params.id
        const { id } = req.user
         
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            })
        }


        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                succes: false,
                message: 'No task found'
            })
        }

        if (id !== task.userId.toString()) {
            return res.status(401).json({
                success: false,
                message: 'You do not permission do update this task'
            })
        }

        task.completed = true
        await task.save()

        return res.status(200).json({
            success: true,
            message: 'Task marked complete'
        })
    }
    catch (error) {
        console.error
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const markIncomplete = async (req, res) => {
    try {
        const taskId = req.params.id
        const { id } = req.user
         
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            })
        }

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                succes: false,
                message: 'No task found'
            })
        }

        if (id !== task.userId.toString()) {
            return res.status(401).json({
                success: false,
                message: 'You do not permission do update this task'
            })
        }

        task.completed = false
        await task.save()

        return res.status(200).json({
            success: true,
            message: 'Task marked incomplete'
        })
    }
    catch (error) {
        console.error
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const filterComplete = async (req, res) => {
    try {
        const { roles } = req.user
        const allowedRoles = [ 5050, 5005 ]

        const isAuthorized = roles.some(role => allowedRoles.includes(role))

        if (!isAuthorized) {
            return res.status(401).json({
                success: false,
                message: 'You do not permission to perform this action'
            })
        }

        const tasks = await Task.find({ completed: true }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: 'Completed tasks:',
            data: tasks
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            succes: false,
            message: 'Internal server error'
        })
    }
}

const filterIncomplete = async (req, res) => {
    try {
        const { roles } = req.user
        const allowedRoles = [ 5050, 5005 ]

        const isAuthorized = roles.some(role => allowedRoles.includes(role))

        if (!isAuthorized) {
            return res.status(401).json({
                success: false,
                message: 'You do not permission to perform this action'
            })
        }

        const tasks = await Task.find({ completed: false }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: 'Completed tasks:',
            data: tasks
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({

        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id
        const roles = req.user.roles

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            })
        }

        const allowedRoles = [ 5050, 5005 ]
        const isAuthorized = roles.some(role => allowedRoles.includes(role))

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Cannot perform this action'
            })
        }

        const task = await Task.findById({ _id: id })

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'No task found'
            })
        }

        await Task.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: 'Task successfully deleted'
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'An error has occured'
        })
    }
}

module.exports = {
    getTasks,
    createTask,
    getTaskById,
    markComplete,
    markIncomplete,
    filterComplete,
    filterIncomplete,
    deleteTask
}