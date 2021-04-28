import ProductModel from "../models/product";
import { Request, Response, NextFunction } from 'express';
import { sendEanToRabbitMQ } from "../utils/send_ean";

// Todo review all inputs and validate them same as in auth.ts 
// Create some kind of product and user validator that acts as a middleware
export const getAllProducts = (req: Request, res: Response) => {
    const products = ProductModel.find().limit(5)
    .select("name brand corporation ean state")
    .then(products => {
        return res.status(200).json({products: products})
    })
    .catch(err => console.log(err));
};

export const getProduct = (req: Request, res: Response) => {
    const ean = req.params.ean
    const product = ProductModel.find({ean: ean})
    .then(product => {
        if (product.length > 0) {
            return res.status(200).json({product: product})
        } else {
            console.log("Product gets scraped")
            try{
                sendEanToRabbitMQ(ean)
                return res.status(409).json({message: "Product will be available soon!"})
            }
            catch(err){
                console.log(err)
                return res.status(500).json({
                    message: "Product couldn't be created"
                })
            }
        }
    })
    .catch(err => console.log(err));
}

export const createProduct =  (req: Request, res: Response) => {
    ProductModel.findOne({ean: req.body.ean})
    .then(product => {
        if(product){
            return res.status(401).json({message: "Product already exists"})
        }
        else {
            const product = new ProductModel({
                name: req.body.name, 
                brand: req.body.brand, 
                corporation: req.body.corporation, 
                ean: req.body.ean,
                state: "unverified"
            })
            product.save()
            .then(result => {
                return res.status(200).json({
                    product: result
                })
            })
            .catch((err: Error) => {
                console.log(err)
                return res.status(500).json({
                    message: "Product couldn't be created"
                })
            })
        }
    })
    .catch((err: Error) => {
        console.log(err)
        return res.status(500).json({
            message: "Product couldn't be created"
        })
    })

};
