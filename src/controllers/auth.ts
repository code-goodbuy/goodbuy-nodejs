import UserModel from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import config from 'config';

export const registerUser = (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const userAlreadyExist = UserModel.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) return res.status(409).json({
                message: "User does not exist or password/email is wrong"
            })
            var password: string = req.body.password
            const saltRounds: number = 10;
            var bcrypt = require('bcrypt');
            bcrypt.hash(password, saltRounds, function (err: Error, hash: String) {
                if (err) return res.status(500).json({
                    message: "internal server error"
                });
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

export const loginUser = (req: Request, res: Response) => {
    const email: string = req.body.email
    const password: string = req.body.password
    const bcrypt = require('bcrypt')
    const user = UserModel.findOne({ email: email })
        .then(user => {
            if (user === null) {
                return res.status(409).json({ message: "User does not exist or password/email is wrong" })
            }
            bcrypt.compare(password, user.password, function (err: Error, result: Boolean) {
                if (result) {
                    const accessTokenSecret: String = config.get("ACCESS_TOKEN_SECRET")
                    var jwt = require('jsonwebtoken');
                    const accessToken = jwt.sign({email: email}, accessTokenSecret, { expiresIn: '168h' })
                    return res.status(200).json(
                        { "jwtAccessToken": accessToken })
                }
                else {
                    return res.status(409).json({ message: "User does not exist or password/email is wrong" })
                }
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(501).json({ message: "internal server error" })
        }
        );
}