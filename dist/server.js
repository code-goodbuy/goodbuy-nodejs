"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_validator_1 = __importDefault(require("express-validator"));
const config_1 = __importDefault(require("config")); //we load the db location from the JSON files
const db = config_1.default.get("DBHost");
//db
mongoose_1.default
    .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
// bring in routes
const product_1 = __importDefault(require("./routes/product"));
//middleware
app.use(morgan_1.default("dev")); // Logging HTTP Requests and Errors
app.use(body_parser_1.default.json()); // Parse incoming request bodies
app.use(express_validator_1.default()); // Validate incoming data
app.use("/", product_1.default);
const port = 8080;
module.exports = app.listen(port, () => { console.log(`Your Node Js API is listening on port: ${port}`); });
