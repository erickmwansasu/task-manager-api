const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const loginPage = (req, res) => {
    res.render('../views/users/login-page')
}

const registerPage = (req, res) => {
    res.render('../views/users/register-page')
}

const handleUserRegistration = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        if (!email || !password) {
            return res.status(402).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        const emailExists = await User.findOne({email})

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: 'User with this email address exist!'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email: email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(200).redirect('/login-page')
    }
    catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: 'An error has occured!'
        })
    }
}

const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        if (!email || !password) {
            return res.status(402).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        const loggedUser = await User.findOne({ email })
        //console.log(loggedUser.roles)  Will throw an error if the user does not exist

        if (!loggedUser) {
            return res.status(404).json({
                success: false,
                message: 'No user with this email!'
            })
        }

        const match = await bcrypt.compare(password, loggedUser.password)

        if (match) {
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        email: email,
                        roles: loggedUser.roles,
                        fullName: loggedUser.fullName,
                        phone: loggedUser.phone,
                        id: loggedUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )

            const refreshToken = jwt.sign(
                { email: email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            loggedUser.refreshToken = refreshToken
            await loggedUser.save()

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            })

            if (loggedUser.roles.includes(5150)) {
                res.redirect('/admin-dashboard')
            } else {
                res.redirect('/user-home')
            }
        } else {
            return res.status(500).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        
    }
    catch (error) {
        console.error(error)
        return res.status(403).json({
            success: false,
            message: 'An error has occurred'
        })
    }
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    console.log('Refresh Token:', refreshToken)

    if (!refreshToken) {
        return res.status(403).json({
            success: false,
            message: 'No Refresh Token'
        })
    }

    try {
        const user = await User.findOne({ refreshToken })

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token'
            })
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(404).json({
                    success: false,
                    message: 'Invalid or expired refresh token'
                })
            }
        })

        const newAccessToken = jwt.sign(
            {
                userInfo: {
                email: user.email,
                roles: user.roles,
                fullName: user.fullName
            }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        )

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        })

        res.redirect('/login-page')
    }
    catch (error) {
        console.error(error)
        return res.status(403).json({
            sucess: false,
            message: 'An error has occured'
        })
    }
}

const handleUserLogout = async (req, res) => {
    let refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(403).json({
            success: false,
            message: 'Access token has expired'
        })
    }

    const user = await User.findOne({refreshToken})

    if (!user) {
        res.status(403).json({
            success: false,
            message: 'No user found'
        })
    }

    user.accessToken = ''
    user.refreshToken = ''

    await user.save()

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    res.redirect('/login-page')
}

module.exports = {
    loginPage,
    registerPage,
    handleUserRegistration,
    handleUserLogin,
    refreshToken,
    handleUserLogout
}