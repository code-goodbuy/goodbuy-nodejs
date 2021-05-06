import { Request, Response, NextFunction } from 'express';

export const createProductValidator = (req: Request , res: Response, next: NextFunction) => {
    req.check('name', "Product name is invalid").notEmpty().matches('^[A-Za-z0-9 ß.é%]+$')
    req.check('name', "Product name must be between 2 to 50 Characters").isLength({
        min:2, 
        max:50,
    });
    req.check('brand', "Brand name is invalid").notEmpty().matches('^[A-Za-z0-9 ß.é%]+$')
    req.check('brand', "Brand name must be between 2 to 50 Characters").isLength({
        min:2, 
        max:50,
    });
    req.check('corporation', "Corporation name is invalid").notEmpty().matches('^[A-Za-z0-9 ß.é%]+$')
    req.check('corporation', "Corporation name must be between 2 to 50 Characters").isLength({
        min:2, 
        max:50,
    });
    req.check('ean', "Ean is invalid").notEmpty().isNumeric()
    req.check('ean', "Ean mus be 8 or 13 Characters").isLength({
        min: 8,
        max: 13
    })
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
export const deleteProductValidator = (req: Request , res: Response, next: NextFunction) => {
    req.check('ean', "Ean is missing").notEmpty().isNumeric()
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
