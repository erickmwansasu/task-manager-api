const Task = require('../models/task')
const { all } = require('../routes/adminRoutes')

const allTasks = async (req, res) => {
   try {
    const roles = req.user.roles
    console.log(roles)
    const allTasks = await Task.find().sort({ createdAt: -1 })
    console.log('All Tasks', allTasks)
   }
   catch (error) {

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
            userId: userId
        })

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

module.exports = {
    allTasks,
    createTaskView,
    createNewTask
}