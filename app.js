const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3500;

//MongoDB Connection
const dbURI = process.env.MONGO_URI
mongoose.connect(dbURI)
  .then( () => console.log('Connected successfully'))
  .catch( (err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1) //Stops the server if DB is unreachable
  })

app.use(express.json())
app.use(cookieParser())

const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const userRoutes = require('./routes/userRoutes')

const authorize = require('./middleware/authorization')
const authenticate = require('./middleware/authentication')

const rolesList = require('./config/rolesList')

app.use(authenticate)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/task', taskRoutes)
app.use('/api/v1/user', userRoutes)

app.use('/api/v1/admin', authorize(rolesList.admin), adminRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`)
})
