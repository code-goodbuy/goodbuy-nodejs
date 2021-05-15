import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import promBundle from 'express-prom-bundle';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import documentationRoutes from "./routes/documentation";
import productRoutes from "./routes/product";
import profileRoutes from "./routes/profile";
import userRoutes from "./routes/user";
import job from "./utils/db_cronjob";
import rt from "file-stream-rotator";
import cors from "cors";
const apiErrorHandler = require('./error/api-error-handler');

class App {
    public app: express.Application;

    private accessLogStream = rt.getStream({
        filename: "log/access-%DATE%.log",
        frequency: "daily",
        verbose: true,
        max_logs: "7d",
    });

    constructor() {
        this.app = express();

        this.connectToDatabase();
        this.startBackupService();
        this.initMiddlewares();
        this.initRoutes();
    }

    public listen() {
        const port = 8080;
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}.`)
        });
    }

    private initMiddlewares() {
        morgan.token(
            "custom",
            // @ts-ignore
            "[:date[iso]] [:user-agent] [:http-version] [:method] [:url] [:status] [:total-time ms]"
        );
        this.app.use(cookieParser());
        this.app.use(morgan("custom", { skip: (req, res) => process.env.DBHost === 'mongodb://127.0.0.1:27017/testing' })); // Logging HTTP Requests and Errors
        this.app.use(morgan("custom", {
            stream: this.accessLogStream,
            skip: (req, res) => { return req.originalUrl.startsWith('/api/metrics') }
        }));
        this.app.use(bodyParser.json({ limit: 1000, type: "application/json" })); // The size limit of request in bytes + content type
        this.app.use(cors({ origin: /https:\/\/goodbuy-*[\w\d-]*.vercel.app$/ }));
        this.app.use(expressValidator());
        this.app.use(promBundle({
            metricsPath: '/api/metrics',
            autoregister: true,
            includeStatusCode: true,
            includePath: true,
            includeMethod: true,
            includeUp: true,
        })); // Prometheus logging
    }

    private initRoutes() {// Validate incoming data
        this.app.use('/api', authRoutes);
        this.app.use('/api', productRoutes);
        this.app.use('/api', profileRoutes);
        this.app.use('/api', documentationRoutes)
        this.app.use('/api', userRoutes)
        this.app.use(apiErrorHandler)
        console.log('Routes initiated.');
    }

    private connectToDatabase() {
        let db = '';

        if (process.env.DBHost) {
            db = process.env.DBHost;
        }
        mongoose
            .connect(db, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
            .then((res) => {
                console.log('Database connected!');
            }
            )
            .catch((err) => console.log(err));
    }

    private startBackupService() {
        job.backupDB();
        console.log('DB Backup service started.')
    }
}

export default App;