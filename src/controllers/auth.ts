import UserModel from '../models/user.model';
import User from '../models/user.interface';
import { Request, Response, NextFunction } from 'express';
import config from 'config';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import client from 'prom-client';

const registerCounter = new client.Counter({
  name: 'total_user_registered',
  help: 'The total number of registered Users'
});

// const histogram = new client.Histogram({
//   name: 'node_request_duartion_seconds',
//   help: 'Histogram for the duration in seconds',
//   buckets: [1, 2, 5, 6, 10]
// });


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
                        if (success) {
                            registerCounter.inc()
                            return res.status(200).json({
                                message: "User was successfully created"
                            })
                        } 
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
    const user = UserModel.findOne({ email: email })
        .then(user => {
            if (user === null) {
                return res.status(409).json({ message: "User does not exist or password/email is wrong" })
            }
            if (user.tokenVersion == null) {
                return res.status(401).json({ message: "Missing Token Version" })
            }
            bcrypt.compare(password, user.password, function (err: Error, result: Boolean) {
                if (result) {
                    res.cookie('jid', createRefreshToken(email, user.tokenVersion),
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

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({ message: "JWT is missing, access denied" })
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        const jwt = require('jsonwebtoken');
        jwt.verify(token, accessTokenSecret, (err: Error, user: User) => {
            if (err) return res.status(401).json({ err })
            req.body.user = user
            next()
        })
    }
}

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jid;
    if (token == null) return res.status(401).json({ message: "JWT Refresh Token is missing, access denied" })
    let payload: any = null
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        try {
            payload = verify(token, refreshTokenSecret)
            return res.status(200).json({
                accessToken: createAccessToken(req.body.email)
            })
        }
        catch (err) {
            return res.status(401).json({ err })
        }
    }

}

export const createAccessToken = (email: string) => {
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        return sign({ email: email }, accessTokenSecret, { expiresIn: '5m' })
    }
}


export const createRefreshToken = (email: string, tokenVersion: number) => {
    if(process.env.REFRESH_TOKEN_SECRET){
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        return sign({ email: email, tokenVersion: tokenVersion }, refreshTokenSecret, { expiresIn: '168h' })
    }
}

export const revokeRefreshToken = (req: Request, res: Response) => {
    // Todo read the tokenVersion and email from the refreshToken
    // Tests will have to be updated accordingly
    console.log(req.cookies.jid)
    let newTokenVersion: number = req.body.tokenVersion
    let email: string = req.body.email
    if (email == null) {
        return res.status(401).json({ message: "Missing Email" })
    }
    if (newTokenVersion == null) {
        return res.status(401).json({ message: "Missing Token Version" })
    }
    newTokenVersion += 1
    try {
        let updatedUser = UserModel.updateOne(
            { email: email },
            { tokenVersion: newTokenVersion }
        )
        return res.status(200).json({
            message: "Revoked refresh_token successfully"
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Problem with revoking the token"
        })
    }
}