"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProduct = exports.getAllProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const getAllProducts = (req, res) => {
    const products = product_1.default.find()
        .select("name brand corporation barcode state")
        .then(products => {
        res.status(200).json({ products: products });
    })
        .catch(err => console.log(err));
};
exports.getAllProducts = getAllProducts;
const getProduct = (req, res) => {
    const barcode = req.params.barcode;
    const product = product_1.default.find({ barcode: barcode })
        .then(product => {
        res.status(200).json({ product: product });
    })
        .catch(err => console.log(err));
};
exports.getProduct = getProduct;
const createProduct = (req, res) => {
    const product = new product_1.default(req.body);
    product.save()
        .then(result => {
        res.status(200).json({
            product: result
        });
    });
};
exports.createProduct = createProduct;
