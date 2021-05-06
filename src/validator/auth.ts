import { Request, Response, NextFunction } from 'express';

export const createUserValidator = (req: Request , res: Response, next: NextFunction) => {
    req.check('username', "Username is invalid").notEmpty().matches('^[A-Za-z0-9 ]+$')
    req.check('username', "Username must be between 5 to 22 Characters").isLength({
        min:5, 
        max:22,
    });
    req.check('email', "Email is invalid").notEmpty().isEmail().normalizeEmail()
    req.check('email', "Email must be between 6 to 40 Characters").isLength({
        min:6, 
        max:40,
    });
    req.check('password', "Password is invalid").notEmpty().isString()
    req.check('password', "Password must be between 8 to 50 Characters").isLength({
        min:8, 
        max:50,
    });
    req.check('acceptedTerms', "acceptedTerms is missing").notEmpty().isBoolean()
    req.check('hasRequiredAge', "hasRequiredAge is missing").notEmpty().isBoolean()
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
export const loginUserValidator = (req: Request , res: Response, next: NextFunction) => {
    req.check('email', "Email is invalid").notEmpty().isEmail().normalizeEmail()
    req.check('email', "Email must be between 6 to 40 Characters").isLength({
        min:6, 
        max:40,
    });
    req.check('password', "Password is invalid").notEmpty().isString()
    req.check('password', "Password must be between 8 to 50 Characters").isLength({
        min:8, 
        max:50,
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