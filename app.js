const express = require('express');
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config()

//db 
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

// bring in routes 
const postRoutes = require('./routes/post');

//middleware
app.use(morgan("dev"));

app.use("/", postRoutes);

const port = process.env.port || 8080;
app.listen(port, () => {console.log(`A Node Js API is listening on port: ${port}`)});