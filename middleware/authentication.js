const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(403).json({
            success: false,
            message: 'No access token!'
        })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        req.user = decoded.userInfo
        console.log('User:', req.user)

        next()
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Server side error!'
        })
    }
}

//Check for roles in the request
//try catch
//Sleep now buddy - merge first thing in the morning

module.exports = authenticate