const Task = require('../models/task')

const userHome = (req, res) => {
    res.render('../views/users/home-page')
}

const userProfile = (req, res) => {
    res.render('../views/users/user-profile')
}


module.exports = {
    userHome,
    userProfile
}