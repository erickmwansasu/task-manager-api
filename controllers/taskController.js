const Task = require('../models/task')
const User = require('../models/user')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

//Helper function to format date
const formatDate = (date) => {
    return new Date(date)
    .toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace('am', 'AM').replace('pm', 'PM')
}

const allTasks = async (req, res) => {
   try {
    const roles = req.user.roles
    console.log('User roles:', roles)

    const userId = req.user.id
    console.log('User ID:', userId)

    const user = await User.findById({ _id: userId })
    console.log(user)
    const userName = user.fullName
    console.log('Logged user is', userName)

    if (roles.includes(5150)) {
        const allTasks = await Task.find().sort({ createdAt: -1 })

        const formattedTasks = allTasks.map(task => ({
            ...task.toObject(),
            dueDateFormatted: formatDate(task.dueDate)
        }))

        console.log(formattedTasks)

        res.render('../views/admin/all-tasks', { allTasks: formattedTasks })
    } else {
        const allTasks = await Task.find({ userId }).sort({ createdAt: -1 })

        const formattedTasks = allTasks.map(task => ({
            ...task.toObject(),
            dueDateFormatted: formatDate(task.dueDate)
        }))

        res.render('../views/users/user-tasks', { allTasks: formattedTasks })
    }

   }
   catch (error) {
    console.error(error)
    res.status(403).json({
        succes: false,
        message: 'An error has occured!'
    })
   }
}

const createTaskView = (req, res) => {
    const { fullName, phone } = req.user

    if (fullName === null || phone === null ) {
        res.redirect('/update-profile-page')
    } else {
        res.render('../views/users/create-task')
    }
}

const createNewTask = async (req, res) => {
    try {
        const { taskName, description, dueDate } = req.body
        const userId = req.user.id
        const fullName = req.user.fullName
        const roles = req.user.roles

        const newTask = new Task({
            taskName: taskName,
            description: description,
            dueDate: dueDate,
            userId: userId,
            userName: fullName
        })

        const taskExists = await Task.findOne({ taskName })

        if (taskExists) {
            return res.status(409).json({
                success: false,
                message: 'Task already exists!'
            })
        }

        await newTask.save()

        if (roles.includes(5150)) {
            res.redirect('/admin-dashboard')
        } else {
            res.redirect('/user-home')
        }
    }
    catch (error) {
        console.error(error)
        return res.status(402).json({
            success: false,
            message: 'An error has occured'
        })
    }
}

const taskDetails = async (req, res) => {
    const id = req.params.id
    const roles = req.user.roles
    console.log('Logged user roles:', roles)
    const task = await Task.findOne({ _id: id })
    console.log(task)
    
    if (roles.includes(5150)) {
        res.render('../views/admin/task-details', { task })
    } else {
        res.render('../views/users/task-details', { task })
    }
}

const deleteTask = async (req, res) => {
    const id = req.params.id
    const roles = req.user.roles

    const task = await Task.findByIdAndDelete({ _id: id })

    if (roles.includes(5150)) {
        res.redirect('/all-tasks')
    } else {
        res.redirect('/user-tasks')
    }
}

module.exports = {
    allTasks,
    createTaskView,
    createNewTask,
    taskDetails,
    deleteTask
}