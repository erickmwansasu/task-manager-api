const jwt = require('jsonwebtoken')

const accessToken = res.cookies.accessToken

//Check for roles in the request
//try catch
//Sleep now buddy - merge first thing in the morning

const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)