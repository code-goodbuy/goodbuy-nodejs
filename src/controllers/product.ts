import ProductModel from "../models/product";
import { Request, Response, NextFunction } from 'express';
import { sendEanToRabbitMQ } from "../utils/send_ean";

export const getAllProducts = (req: Request, res: Response) => {
    const products = ProductModel.find().limit(5)
    .select("name brand corporation ean state")
    .then(products => {
        res.status(200).json({products: products})
    })
    .catch(err => console.log(err));
};

export const getProduct = (req: Request, res: Response) => {
    const ean = req.params.ean
    const product = ProductModel.find({ean: ean})
    .then(product => {
        if (product.length > 0) {
            res.status(200).json({product: product})
        } else {
            res.status(204).json({product: product})
            console.log("Product gets scraped")
            sendEanToRabbitMQ(ean)
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
