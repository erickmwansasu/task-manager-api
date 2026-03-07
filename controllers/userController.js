const mongoose = require('mongoose')
const Task = require('../models/task')
const User = require('../models/user')

//Deleted userHome controller that rendersuser Home Page - as you said its frontend work
//Did the same for userProfile controller

const updateProfile = async (req, res) => {
    try {
        const { fullName, department, empId, phone } = req.body
        const id = req.user.id

        if (fullName === '' || department === '' || phone === '') {
            return res.status(400).json({
                success: false,
                message: 'Fill all details'
            })
        }

        if (!fullName || !department || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Fill all details'
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No user found'
            })
        }

        const updateUser = await User.findByIdAndUpdate(id,
            { fullName: fullName, department: department, empId: empId, phone: phone },
            { new: true, runValidators: true }
        ).select('-password')
        
        return res.status(200).json({
            success: true,
            message: 'Profile updated',
            data: updateUser
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'An error has occured!'
        })
    }

}

module.exports = {
    updateProfile
}