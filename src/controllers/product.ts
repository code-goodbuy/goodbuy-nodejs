import ProductModel from "../models/product";
import { Request, Response, NextFunction } from 'express';
import { sendEanToRabbitMQ } from "../utils/send_ean";
import { ObjectID } from "mongodb";
const configcat = require("configcat-node");

//  ************** //
//  RESPONSE CODES 
//  200 -> OK -> GET: Die Ressource wurde geholt und wird im Nachrichtentext übertragen. 
//            -> POST: Die Ressource, die das Ergebnis der Aktion beschreibt, wird im Hauptteil der Nachricht übertragen.
//  400 -> Bad Request
//  401 -> Unauthorized
//  409 -> Conflict
//  500 -> Something went wrong

export const getAllProducts = (req: Request, res: Response) => {
    const products = ProductModel.find({verified: true}).limit(5)
    .select("name brand corporation ean -_id")
    .then(products => {
        return res.status(200).json({products: products})
    })
    .catch((err) => {
        console.log(err)
        return res.status(500).json({message: "Something went wrong"})
    });
};

export const getProduct = (req: Request, res: Response) => {
        if((req.params.ean.length !== 8 && req.params.ean.length !== 13)){
            return res.status(400).json({message: "Invalid ean code"})
        }
        // TODO look here if(product.verified) in query and  then create compound index for that and delete if
        ProductModel.findOne({_id: req.params.ean})
        .select("name brand corporation ean verified -_id")
        .then(product => {
            if (product) {
                if(product.verified){
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
                    sendEanToRabbitMQ(req.params.ean)
                    return res.status(409).json({message: "Product is not available yet!"})
                }
                catch(err){
                    console.log(err)
                    return res.status(500).json({
                        message: "Something went wrong"
                    })
                }
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({
                message: "Something went wrong"
            })
        });
}

export const createProduct =  (req: Request, res: Response) => {
    if((req.body.ean.length !== 8 && req.body.ean.length !== 13)){
        return res.status(400).json({message: "Invalid ean code"})
    }
    ProductModel.findOne({_id: req.body.ean})
    .select("_id")
    .then(product => {
        if(product){
            return res.status(409).json({message: "Product already exists"})
        }
        else {
            const product = new ProductModel({
                _id: req.body.ean,
                name: req.body.name, 
                brand: req.body.brand, 
                corporation: req.body.corporation, 
                ean: req.body.ean,
                verified: false,
                created_at: new Date().getTime()
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
            // TODO update with _id because thats indexed its also ean
            ProductModel.findOneAndDelete({_id: req.body.ean})
            .select("_id")
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