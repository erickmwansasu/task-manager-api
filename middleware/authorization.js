const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.user?.roles || []
        console.log('User roles:', roles)

        if (!roles.length) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden!'
            })
        }

        const rolesArray = [...allowedRoles]
        console.log(rolesArray)

        const isAuthorized = roles.some(role => allowedRoles.includes(role))

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized!'
            })
        }
        next ()
    }
}

module.exports = authorize