import { Request, Response, NextFunction } from 'express';
export const updateProfileValidator = (req: Request, res: Response, next: NextFunction) => {
  // TODO is only checking for length but not what is allowed etc.
  req.check("description", "description should be less than 256 character").isLength({
    min: 0,
    max: 256
  });
  // allow alphabet, number, -, _, . only 
  req.check("description", "description doesn't allow special character").matches(/^[a-z\d\-_.\s]+$/i)
  req.check("imageURL", "Image URL is invalid").isURL();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error: { msg: string; }) => error.msg)[0];
    return res.status(400).json({ message: "profile validator error", error: firstError });
  }
  next();
}
