const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.user?.roles || []

        if (!roles.length) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden!'
            })
        }

        const isAuthorized = roles.some(role => allowedRoles.includes(role))

        if (!isAuthorized) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized!'
            })
        }
        next ()
    }
}

module.exports = authorize