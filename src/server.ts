import express from 'express';
const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import expressValidator from "express-validator";
import config from "config"; //we load the db location from the JSON files
import cors from 'cors';
import cookieParser from 'cookie-parser';
import promBundle from "express-prom-bundle";
const metricsMiddleware = promBundle({
  autoregister: true,
  includeStatusCode: true,
  includePath: true,
  includeMethod: true,
  includeUp: true,
});

let db = "";

if (process.env.DBHost) {
  db = process.env.DBHost
}

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
app.use(cookieParser());
app.use(morgan("dev" ,{ skip: (req, res) => process.env.NODE_ENV === 'test' })); // Logging HTTP Requests and Errors
app.use(bodyParser.json()); // Parse incoming request bodies
app.use(expressValidator()); // Validate incoming data
app.use(metricsMiddleware); // Prometheus logging
app.use("/", authRoutes);
app.use("/", productRoutes);

const port = 8080;
module.exports = app.listen(port, () => {console.log(`Your Node Js API is listening on port: ${port}`)});
