const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const methodOverride = require("method-override");

require("dotenv").config();
const PORT = process.env.PORT || 3500;

const app = express();

//MongoDB Connection
const connection = process.env.dbURI
mongoose.connect(connection);
//.then()

//Middleware to accept JSON
app.use(express.json());
app.use(methodOverride("_method"));

//Middleware to serve static files
app.use(express.static("public"));

//Middleware to accept/handle form data
app.use(express.urlencoded({ extended: true }));

//Middleware for cookies
app.use(cookieParser());

//Set view engine
app.set("view engine", "ejs");

//Routes imports
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

//Routes
app.use(adminRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});
