const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.user.roles
        console.log('User roles:', roles)

        if (!roles) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden!'
            })
        }

        const rolesArray = [...allowedRoles]
        console.log(rolesArray)

        const result = roles.map(role => rolesArray.includes(role)).find(val => val === true)

        if (!result) {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized!'
            })
        }
        next ()
    }
}

module.exports = authorize