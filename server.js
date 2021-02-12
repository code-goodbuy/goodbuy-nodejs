const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const morgan = require("morgan");
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
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", productRoutes);

const port = process.env.port || 8080;
app.listen(port, () => {console.log(`Your Node Js API is listening on port: ${port}`)});