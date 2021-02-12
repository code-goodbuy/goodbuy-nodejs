const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressValidator = require("express-validator");
const dotenv = require("dotenv");
dotenv.config()

const db = process.env.MONGO_URI_LOCAL

//db 
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

// bring in routes 
const productRoutes = require('./routes/product');

//middleware
app.use(morgan("dev")); // Logging HTTP Requests and Errors
app.use(bodyParser.json()); // Parse incoming request bodies
app.use(expressValidator()); // Validate incoming data
app.use("/", productRoutes);

const port = process.env.port || 8080;
app.listen(port, () => {console.log(`Your Node Js API is listening on port: ${port}`)});