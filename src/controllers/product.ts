import ProductModel from "../models/product";
import { Request, Response, NextFunction } from 'express';
import { sendBarcodeToRabbitMQ } from "../utils/send_barcode";

export const getAllProducts = (req: Request, res: Response) => {
    const products = ProductModel.find()
    .select("name brand corporation barcode state")
    .then(products => {
        res.status(200).json({products: products})
    })
    .catch(err => console.log(err));
};

export const getProduct = (req: Request, res: Response) => {
    const barcode = req.params.barcode
    const product = ProductModel.find({barcode: barcode})
    .then(product => {
        if (product.length > 0) {
            res.status(200).json({product: product})
        } else {
            res.status(204).json({product: product})
            console.log("Product gets scraped")
            sendBarcodeToRabbitMQ(barcode)
        }
    })
    .catch(err => console.log(err));
}

export const createProduct =  (req: Request, res: Response) => {
    const product = new ProductModel(req.body)
    product.save()
    .then(result => {
        res.status(200).json({
            product: result
        })
    })
};
