import UserModel from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

export const registerUser = (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const userAlreadyExist = UserModel.findOne({ email: email })
        .then(userDoc => {
            // TODO send status 409 because email already exists clarify with frontend 
            // TODO should we display this information?
            if (userDoc) return res.status(409).json({
                message: "This email already exists"
            })
            var password: string = req.body.password
            const saltRounds: number = 10;
            var bcrypt = require('bcrypt');
            bcrypt.hash(password, saltRounds, function (err: Error, hash: String) {
                // TODO send status 500 because something went wrong clarify with frontend
                if (err) return res.status(500).json({
                    message: "internal server error"
                });
                // Store hash in your DB.
                req.body.password = hash
                const user = new UserModel(req.body)
                user.save()
                    .then(success => {
                        if (success) return res.status(200).json({
                            message: "User was successfully created"
                        })
                        return res.status(500).json({
                            message: "internal server error"
                        })
                    })
                    .catch((err: Error) => (console.log(err)));
            })
        })
        .catch((err: Error) => console.log(err));
}