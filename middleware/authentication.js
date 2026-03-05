const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    const publicPaths = ['/register', '/login', '/refreshToken']

    const isPublic = publicPaths.some(path => req.path.endsWith(path))

    if(isPublic) {
        return next()
    }

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

        next()
    }
    catch (error) {
        console.error(error)
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token!'
        })
    }
}

module.exports = authenticate