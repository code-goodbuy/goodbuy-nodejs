import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
const ApiError = require('../error/ApiError');

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if(res.locals.payload.isAdmin === true){
        console.log("helloo")
        next()
    }
    else{
        next(ApiError.unauthorized('You are not authorized to perform this action'))
        return
    }
}

export const createAdmin = (req: Request, res: Response, next: NextFunction ) => {
    UserModel.findOne({username: req.body.username})
    .then((userDoc) => {
        if(userDoc){
            userDoc.isAdmin = true
            userDoc.save()
            .then(success => {
                if(success){
                    return res.status(200).json({ message: "Admin was created "})
                }
                else{
                    next(ApiError.internal("Something went wrong"))
                    return
                }
            })
            .catch((err) => {
                next(ApiError.internal("Something went wrong"))
                return
            })
        }
        else{
            return res.status(404).json({ message: "User not found"})
        }
    })
    .catch((err) => {
        next(ApiError.internal("Something went wrong"))
        return
    })
}