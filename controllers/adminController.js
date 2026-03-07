const User = require('../models/user')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find().sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: 'Users found:',
            data: allUsers
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error!'
        })
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, roles } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email or password is missing!'
            })
        }

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'User with email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email: email,
            password: hashedPassword,
            roles: roles
        })

        await newUser.save()
        
        return res.status(201).json({
            success: true,
            message: 'User successfully created',
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const { email, roles, empId } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                })
            }

        const userExists = await User.findById(id)

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'No user with this ID'
            })
        }

        const emailExists = await User.findOne({ email })

        if (emailExists && email === req.user.email) {
            return res.status(409).json({
                success: false,
                message: 'This is the current active email. Try a diffeent email'
            })
        }

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: 'Email already taken. Try another one!'
            })
        }

        const updateUser = await User.findByIdAndUpdate(id,
            { email, roles, empId },
            { new: true, runValidators: true }
        )

        await updateUser.save()

        return res.status(200).json({
            success: true,
            message: 'User details updated',
            data: updateUser
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user with this ID'
            })
        }

        await User.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: 'User successfully deleted',
            data: user
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}