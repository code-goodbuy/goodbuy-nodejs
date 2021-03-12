"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controllers/product");
const product_2 = require("../validator/product");
const router = express_1.default.Router();
router.get('/', product_1.getAllProducts);
// only if validation is passed it will continue to the product creation
router.post('/product', product_2.createProductValidator, product_1.createProduct);
router.get('/product/:barcode', product_1.getProduct);
exports.default = router;
