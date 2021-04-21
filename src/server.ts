// import express from "express";
// const app = express();
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import morgan from "morgan";
// import expressValidator from "express-validator";
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import promBundle from "express-prom-bundle";
// const metricsMiddleware = promBundle({
//   autoregister: true,
//   includeStatusCode: true,
//   includePath: true,
//   includeMethod: true,
//   includeUp: true,
// });
// import job from "./utils/db_cronjob";
// import rt from "file-stream-rotator";
//
// // log formatting
// morgan.token(
//   "custom",
//   // @ts-ignore
//   "[:date[iso]] [:user-agent] [:http-version] [:method] [:url] [:status] [:total-time ms]"
// );
//
// // writing log stream
// let accessLogStream = rt.getStream({
//   filename: "log/access-%DATE%.log",
//   frequency: "daily",
//   verbose: true,
// });
//
// let db = "";
//
// if (process.env.DBHOST) {
//   db = process.env.DBHOST;
// }
//
// mongoose
//   .connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(async (connection) => {
//     app.listen(app.get("port"), () => {
//       console.log("Database connected!");
//       job.backupDB();
//     });
//     app.on("close", () => {
//       app.removeAllListeners();
//     });
//   })
//   .catch((err) => console.log(err));
//
// // bring in routes
// import productRoutes from "./routes/product";
// import authRoutes from "./routes/auth";
//
// //middleware
// app.use(cors());
// app.use(cookieParser());
// app.use(morgan("dev" ,{ skip: (req, res) => process.env.NODE_ENV === 'test' })); // Logging HTTP Requests and Errors
// app.use(morgan("custom", { stream: accessLogStream })); // writing log stream in 'log/access'
// app.use(bodyParser.json({limit: 1000, type: "application/json"})); // The size limit of request in bytes + content type
// app.use(expressValidator()); // Validate incoming data
// app.use(metricsMiddleware); // Prometheus logging
// app.use("/", authRoutes);
// app.use("/", productRoutes);
//
// const port = 8080;
// module.exports = app.listen(port, () => {
//   console.log(`Your Node Js API is listening on port: ${port}`);
// });

import App from './app'

const app = new App();

app.listen();

module.exports = app.app;
