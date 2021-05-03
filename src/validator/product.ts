import { Request, Response, NextFunction } from 'express';

export const createProductValidator = (req: Request , res: Response, next: NextFunction) => {
    req.check('name', "Product name is missing").notEmpty().isAlpha()
    req.check('name', "Product name must be between 2 to 50 Characters").isLength({
        min:2, 
        max:50,
    });
    req.check('brand', "Brand name is missing").notEmpty().isAlpha()
    req.check('brand', "Brand name must be between 2 to 50 Characters").isLength({
        min:2, 
        max:50,
    });
    req.check('corporation', "Corporation name is missing").notEmpty().isAlpha()
    req.check('corporation', "Corporation name must be between 2 to 50 Characters").isLength({
        min:2, 
        max:50,
    });
    req.check('ean', "Ean is missing").notEmpty().isString().isNumeric()
    req.check('ean', "Ean must be between 4 to 18 Characters").isLength({
        min:4, 
        max:18,
    });
    req.check('state', "Product state is missing").notEmpty().isAlpha()
    req.check('state', "Product state must be between 3 and 20 Characters").isLength({
        min:3, 
        max:20,
    });
    // check for errors
    const errors = req.validationErrors();
    // if error occur show the first one as they happen
    if (errors) {
        const firstError = errors.map((error: { msg: string; }) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
}
export const getProductValidator = (req: Request , res: Response, next: NextFunction) => {
    req.check('ean', "ean is invalid").notEmpty().isString().isNumeric()
    req.check('ean', "ean must be between 4 to 18 Characters").isLength({
        min:8, 
        max:13,
    });
    // check for errors
    const errors = req.validationErrors();
    // if error occur show the first one as they happen
    if (errors) {
        const firstError = errors.map((error: { msg: string; }) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
}
