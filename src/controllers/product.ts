import ProductModel from "../models/product";
import { Request, Response, NextFunction } from 'express';
import { sendEanToRabbitMQ } from "../utils/send_ean";
const configcat = require("configcat-node");

// Todo review all inputs and validate them same as in auth.ts 
// Create some kind of product and user validator that acts as a middleware
export const getAllProducts = (req: Request, res: Response) => {
    const products = ProductModel.find({state: "verified"}).limit(5)
    .select("name brand corporation ean -_id")
    .then(products => {
        return res.status(200).json({products: products})
    })
    .catch(err => console.log(err));
};

export const getProduct = (req: Request, res: Response) => {
    try{
        let ean = parseInt(req.params.ean, 10);

        if((req.params.ean.length !== 8 && req.params.ean.length !== 13)){
            return res.status(401).json({message: "Invalid ean code"})
        }
        ProductModel.findOne({ean: ean})
        .then(product => {
            if (product) {
                if(product.state == "verified"){
                    return res.status(200).json({
                        name: product.name,
                        brand: product.brand, 
                        corporation: product.corporation,
                        ean: product.ean
                    })
                }
                else {
                    return res.status(409).json({message: "Product is not available yet!"})
                }
            } else {
                console.log("Product gets scraped")
                try{
                    sendEanToRabbitMQ(ean.toString())
                    return res.status(409).json({message: "Product is not available yet!"})
                }
                catch(err){
                    console.log(err)
                    return res.status(500).json({
                        message: "Product couldn't be found"
                    })
                }
            }
        })
        .catch(err => console.log(err));
        }
    catch{
        return res.status(401).json({message: "Invalid ean code"})
    }
}

export const createProduct =  (req: Request, res: Response) => {
    if((req.body.ean.toString().length !== 8 && req.body.ean.toString().length !== 13)){
        return res.status(401).json({message: "Invalid ean code"})
    }
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
                    name: result.name,
                    brand: result.brand, 
                    corporation: result.corporation,
                    ean: result.ean
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

export const configCatClient = configcat.createClient(process.env.CONFIG_CAT_KEY);

export const deleteProduct = (req: Request, res: Response) => {
    configCatClient.getValue("deleteproduct", false, (value: boolean) => {
        if(value) {
            ProductModel.findOneAndDelete(req.body.ean)
            .then(productDoc => {
                if(productDoc){
                    res.status(200).json({message: "Product was deleted"})
                }
                else{
                    res.status(409).json({message: "Product doesn't exist"})
                }
            })
            .catch((err: Error) =>{
                console.log(err)
                res.status(500).json({message: "There was a problem deleting the product"})
            })
        } else {
            res.status(404).json({message: "This feature doesn't exist yet"})
        }
    }); 
}