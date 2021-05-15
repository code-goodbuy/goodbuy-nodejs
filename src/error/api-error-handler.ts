import { Request, Response, NextFunction } from 'express';
const ApiError = require('./ApiError');

function apiErrorHandler(err: any, req: Request, res: Response, next: NextFunction){
    // in prod dont use console.log or console err because its not async 
    // use a logging library like winston 
    console.log(err)
    if(err instanceof ApiError) {
        res.status(err.code).json(err.message);
        return
    }
    res.status(500).json('Something went wrong')
}
module.exports = apiErrorHandler;