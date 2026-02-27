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

const newTask = async (req, res) => {
    try {

   }
   catch (error) {

   }
}

module.exports = {
    allTasks,
    newTask
}