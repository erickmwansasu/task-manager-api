const User = require('../models/user')

const adminDashboard = (req, res) => {
    res.render('../views/admin/home')
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().sort({ createdAt: -1 })
        console.log(allUsers)

        res.render('../views/admin/users', { allUsers })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Error loading users!'
        })
    }
}

const additionalFeatures = (req, res) => {

}

const topics = (req, res) => {

}

module.exports = {
    adminDashboard,
    getAllUsers,
    additionalFeatures,
    topics
}