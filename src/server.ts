import express from 'express';
const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import expressValidator from "express-validator";
import config from "config"; //we load the db location from the JSON files
import cors from 'cors';

let db = "";

if (process.env.DBHost) {
  db = process.env.DBHost
}
else if(config.get("DBHost")){
  db = config.get("DBHost")
}
console.log("JFOEJOGEWGEWOJEGs")
console.log(db)
mongoose
.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));


// bring in routes
import productRoutes from './routes/product';
import authRoutes from './routes/auth';

//middleware
app.use(cors());
app.use(morgan("dev")); // Logging HTTP Requests and Errors
app.use(bodyParser.json()); // Parse incoming request bodies
app.use(expressValidator()); // Validate incoming data
app.use("/", authRoutes);
app.use("/", productRoutes);

const port = 8080;
module.exports = app.listen(port, () => {console.log(`Your Node Js API is listening on port: ${port}`)});
