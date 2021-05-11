import { Request, Response, NextFunction } from 'express';

export const findUserValidator = (req: Request, res: Response, next: NextFunction) => {
  req.check('username', "User name is invalid").notEmpty().matches('^[A-Za-z0-9 ]+$')
  req.check('username', "Username must be between 5 to 22 Characters").isLength({
    min: 5,
    max: 22,
  });
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error: { msg: string; }) => error.msg)[0];
    return res.status(400).json({ message: "Input validation error", error: firstError });
  }
  next();
}