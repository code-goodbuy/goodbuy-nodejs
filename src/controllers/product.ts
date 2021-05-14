import ProductModel from "../models/product";
import { Request, Response, NextFunction } from 'express';
import { sendEanToRabbitMQ } from "../utils/send_ean";
const ApiError = require('../error/ApiError');

export const getAllProducts = (req: Request, res: Response, next: NextFunction) => {
    const products = ProductModel.find({ verified: true }).limit(5)
        .select("name brand corporation ean -_id")
        .then(products => {
            return res.status(200).json({ products: products })
        })
        .catch((err) => {
            console.log(err)
            next(ApiError.internal("Something went wrong"))
            return
        });
};

export const getProduct = (req: Request, res: Response, next: NextFunction) => {
    if ((req.params.ean.length !== 8 && req.params.ean.length !== 13)) {
        next(ApiError.badRequest("Invalid ean code"))
        return
    }
    // TODO look here if(product.verified) in query and  then create compound index for that and delete if
    ProductModel.findOne({ _id: req.params.ean })
        .select("name brand corporation ean verified -_id")
        .then(product => {
            if (product) {
                if (product.verified) {
                    return res.status(200).json({
                        name: product.name,
                        brand: product.brand,
                        corporation: product.corporation,
                        ean: product.ean
                    })
                }
                else {
                    next(ApiError.conflict("Product is not available yet!"))
                    return
                }
            } else {
                console.log("Product gets scraped")
                try {
                    sendEanToRabbitMQ(req.params.ean)
                    next(ApiError.conflict("Product is not available yet!"))
                    return
                }
                catch (err) {
                    console.log(err)
                    next(ApiError.internal("Something went wrong"))
                    return
                }
            }
        })
        .catch((err) => {
            console.log(err)
            next(ApiError.internal("Something went wrong"))
            return
        });
}

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
    if ((req.body.ean.length !== 8 && req.body.ean.length !== 13)) {
        next(ApiError.badrequest("Invalid ean code"))
        return
    }
    ProductModel.findOne({ _id: req.body.ean })
        .select("_id")
        .then(product => {
            if (product) {
                next(ApiError.conflict("Product already exists"))
                return
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
                        next(ApiError.internal("Product couldn't be created"))
                        return
                    })
            }
        })
        .catch((err: Error) => {
            console.log(err)
            next(ApiError.internal("Product couldn't be created"))
            return
        })

};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    if ((req.params.ean.length !== 8 && req.params.ean.length !== 13)) {
        next(ApiError.badrequest("Invalid ean code"))
        return
    }
    else {
        ProductModel.findOneAndDelete({ _id: req.params.ean })
            .select("_id")
            .then(productDoc => {
                if (productDoc) {
                    res.status(200).json({ message: "Product was deleted" })
                }
                else {
                    next(ApiError.conflict("Product doesn't exist"))
                    return
                }
            })
            .catch((err: Error) => {
                console.log(err)
                next(ApiError.internal("Product couldn't be created"))
                return
            })
    }

}