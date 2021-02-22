import Product from "../models/product";
import { Request, Response, NextFunction } from 'express';

export const getAllProducts = (req: Request, res: Response) => {
    const products = Product.find()
    .select("name brand corporation barcode state")
    .then(products => {
        res.status(200).json({products: products})
    })
    .catch(err => console.log(err));
};

export const getProduct = (req: Request, res: Response) => {
    const barcode = req.params.barcode
    const product = Product.find({barcode: barcode})
    .then(product => {
        res.status(200).json({product: product})
    })
    .catch(err => console.log(err));
}

export const createProduct =  (req: Request, res: Response) => {
    const product = new Product(req.body)
    product.save()
    .then(result => {
        res.status(200).json({
            product: result
        })
    })
};
