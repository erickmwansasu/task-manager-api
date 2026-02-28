const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const methodOverride = require('method-override');

require('dotenv').config()
const PORT = process.env.PORT;

const app = express()

//Routes imports
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')

//MongoDB Connection
const dbURI = 'mongodb://localhost:27017/taskmanagerapi3'
mongoose.connect(dbURI)

//Middleware to accept JSON
app.use(express.json())
app.use(methodOverride('_method'))

//Middleware to serve static files
app.use(express.static('public'))

//Middleware to accept/handle form data
app.use(express.urlencoded({ extended: true }))

//Middleware for cookies
app.use(cookieParser())

//Set view engine
app.set('view engine', 'ejs')

//Routes
app.use(adminRoutes)
app.use(userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`)
})