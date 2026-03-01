const Task = require('../models/task')
const User = require('../models/user')

const userHome = async (req, res) => {
    const email = req.user.email
    const userDetails = await User.findOne({ email })

    res.render('../views/users/home-page', { userDetails })
}

const userProfile = async (req, res) => {
    const email = req.user.email
    console.log('Logged user is:', email)

    const user = await User.findOne({ email })

    res.render('../views/users/user-profile', { user })
}

const updateProfilePage = (req, res) => {
    res.render('../views/users/update-profile')
}

const updateProfile = async (req, res) => {
    const { fullName, department, empId, phone } = req.body
    const id = req.user.id
    console.log('Logged user:', id)

    const user = await User.findOne({ id })
    console.log(user)

    const updateUser = await User.findByIdAndUpdate(id,
        { fullName: fullName, department: department, empId: empId, phone: phone },
        { new: true, runValidators: true }
    )

    if (fullName === '' || department === '' || phone === '') {
        res.status(403).json({
            success: false,
            message: 'Fill all details'
        })
    }

    if (!updateUser) {
        return res.status(404).json({
            success: false,
            message: 'No user found'
        })
    }

    if (updateUser.roles.includes(5150)) {
        res.redirect('/admin-dashboard')
    } else {
        res.redirect('/user-profile')
    }
}

module.exports = {
    userHome,
    userProfile,
    updateProfilePage,
    updateProfile
}