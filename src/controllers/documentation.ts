import { Request, Response, NextFunction } from 'express';

export const redirectToDocumentation = (req: Request, res: Response, next: NextFunction) => {
    res.redirect('https://app.swaggerhub.com/apis-docs/Goodbuy-node/Goodbuy/1.0.0#/');
}
