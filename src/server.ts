import express from 'express';
const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import expressValidator from "express-validator";
import config from "config"; //we load the db location from the JSON files
import cors from 'cors';

const db: string = config.get("DBHost");

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
import productRoutes from './routes/product';
import authRoutes from './routes/auth';

// We can also define if we want to allow GET / POST etc. for each route, domain etc.
var corsOptions = {
  origin: '*.vercel.app',
  optionsSuccessStatus: 200 // For legacy browser support
}

//middleware
app.use(cors(corsOptions));
app.use(morgan("dev")); // Logging HTTP Requests and Errors
app.use(bodyParser.json()); // Parse incoming request bodies
app.use(expressValidator()); // Validate incoming data
app.use("/", authRoutes);
app.use("/", productRoutes);

const port = 8080;
module.exports = app.listen(port, () => {console.log(`Your Node Js API is listening on port: ${port}`)});
