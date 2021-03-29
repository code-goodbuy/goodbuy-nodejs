import UserModel from '../models/user.model';
import User from '../models/user.interface';
import { Request, Response, NextFunction } from 'express';
import config from 'config';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser = (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const userAlreadyExist = UserModel.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) return res.status(409).json({
                message: "User does not exist or password/email is wrong"
            })
            let password: string = req.body.password
            const saltRounds: number = 10;
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
    const tokenVersion: number = req.body.tokenVersion
    const user = UserModel.findOne({ email: email })
        .then(user => {
            if (user === null) {
                return res.status(409).json({ message: "User does not exist or password/email is wrong" })
            }
            bcrypt.compare(password, user.password, function (err: Error, result: Boolean) {
                if (result) {
                    res.cookie('jid', createRefreshToken(email, tokenVersion), 
                    {
                        httpOnly: true,
                        path: '/refresh_token'
                    })
                    const accessToken = createAccessToken(email)
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

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({ message: "JWT is missing, access denied"})
    const accessTokenSecret: string = config.get("ACCESS_TOKEN_SECRET")
    const jwt = require('jsonwebtoken');
    jwt.verify(token, accessTokenSecret, (err: Error, user: User) => {
        if (err) return res.status(401).json({ err })
        req.user = user
        next()
    })
}

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jid;
    if (token == null) return res.status(401).json({ message: "JWT Refresh Token is missing, access denied"})
    let payload: any = null
    const refreshTokenSecret: string = config.get("REFRESH_TOKEN_SECRET")
    try {
        payload = verify(token, refreshTokenSecret)
        return res.status(200).json({
            accessToken: createAccessToken(req.body.email)
        })
    }
    catch(err) {
        console.log(err)
        return res.status(401).json({ err })
    }
}

export const createAccessToken = (email: string) => {
    const accessTokenSecret: string = config.get("ACCESS_TOKEN_SECRET")
    return sign({email: email}, accessTokenSecret, { expiresIn: '15m' })
}


export const createRefreshToken = (email: string, tokenVersion: number) => {
    const refreshTokenSecret: string = config.get("REFRESH_TOKEN_SECRET")
    return sign({email: email, tokenVersion: tokenVersion}, refreshTokenSecret, { expiresIn: '168h' })
}