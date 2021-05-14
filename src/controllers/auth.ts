import UserModel from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import client from 'prom-client';
import { sendConfirmationEmail } from './email';
const ApiError = require('../error/ApiError');

const registerCounter = new client.Counter({
    name: 'total_user_registered',
    help: 'The total number of registered Users'
});

//  ************** //
//  RESPONSE CODES 
//  200 -> OK -> GET: Die Ressource wurde geholt und wird im Nachrichtentext übertragen. 
//            -> POST: Die Ressource, die das Ergebnis der Aktion beschreibt, wird im Hauptteil der Nachricht übertragen.
//  400 -> Bad Request
//  401 -> Unauthorized
//  409 -> Conflict
//  500 -> Something went wrong

export const registerUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.acceptedTerms || !req.body.hasRequiredAge) {
        next(ApiError.badRequest('You have to agree to our term of condition and have the required age to register as user!'))
        return
    }
    UserModel.findOne({ email: req.body.email })
        .select("_id")
        .then(userDoc => {
            if (userDoc) {
                next(ApiError.conflict("User does not exist or password/email is wrong"))
                return
            }
            UserModel.findOne({ username: req.body.username })
                .select("_id")
                .then(userDoc => {
                    if (userDoc) {
                        next(ApiError.conflict("User does not exist or password/email is wrong"))
                        return
                    }
                    let password: string = req.body.password
                    const saltRounds: number = 10;
                    bcrypt.hash(password, saltRounds, function (err: Error, hash: String) {
                        if (err) {
                            next(ApiError.internal("Something went wrong"))
                            return
                        }
                        req.body.password = hash
                        let confirmationCode = ""
                        if (process.env.EMAIL_CONFIRMATION_SECRET) {
                            confirmationCode = sign({ email: req.body.email }, process.env.EMAIL_CONFIRMATION_SECRET)
                            const user = new UserModel({
                                username: req.body.username,
                                email: req.body.email,
                                password: req.body.password,
                                acceptedTerms: true,
                                hasRequiredAge: true,
                                tokenVersion: 0,
                                active: false,
                                confirmationCode: confirmationCode,
                                created_at: new Date().getTime()
                            })
                            user.save()
                                .then(success => {
                                    if (success) {
                                        sendConfirmationEmail(req.body.username, req.body.email, confirmationCode)
                                        registerCounter.inc()
                                        return res.status(200).json({
                                            message: "User was successfully created, please check your email"
                                        })
                                    }
                                    next(ApiError.internal("Something went wrong"))
                                    return
                                })
                                .catch((err: Error) => {
                                    console.log(err)
                                    next(ApiError.internal("Something went wrong"))
                                    return
                                });
                        }
                        else {
                            console.log("Confirmation secret not found")
                            next(ApiError.internal("Something went wrong"))
                            return
                        }
                    })
                })
                .catch((err: Error) => {
                    console.log(err)
                    next(ApiError.internal("Something went wrong"))
                    return
                });
        })
}

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email
    const password: string = req.body.password
    UserModel.findOne({ email: email })
        .select("username description imageURL tokenVersion active password")
        .then(user => {
            if (user === null) {
                next(ApiError.conflict("User does not exist or password/email is wrong"))
                return
            }
            if (user.tokenVersion == null) {
                next(ApiError.badRequest("Missing Token Version"))
                return
            }
            if (user.active != true) {
                next(ApiError.unauthorized("Pending Account. Please Verify Your Email!"))
                return
            }
            bcrypt.compare(password, user.password, function (err: Error, result: Boolean) {
                if (result) {
                    res.cookie('jid', createRefreshToken(user._id, user.tokenVersion),
                        {
                            httpOnly: true,
                        })
                    const accessToken = createAccessToken(user._id)
                    return res.status(200).json(
                        {
                            "username": user.username,
                            "description": user.description,
                            "imageURL": user.imageURL,
                            "jwtAccessToken": accessToken,
                        })
                }
                else {
                    next(ApiError.conflict("User does not exist or password/email is wrong"))
                    return
                }
            })
        })
        .catch(err => {
            console.log(err)
            next(ApiError.internal("Something went wrong"))
            return
        }
        );
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        next(ApiError.unauthorized("JWT is missing, access denied"))
        return
    }
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        try {
            let payload: any = null
            payload = verify(token, accessTokenSecret, { issuer: "https://gb-be.de/" })
            if (payload) {
                res.locals.payload = payload;
                next()
            }
        }
        catch (err) {
            next(ApiError.unauthorized("Invalid Access Token"))
            return
        }

    }
}

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jid;
    if (token == null) {
        next(ApiError.unauthorized("Invalid refresh Token"))
        return
    }
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        try {
            let payload: any = verify(token, refreshTokenSecret, { issuer: "https://gb-be.de/" })
            const tokenVersion = payload.tokenVersion
            const user = UserModel.findOne({ _id: payload._id })
                .select("tokenVersion")
                .then(user => {
                    if (user?.tokenVersion === tokenVersion) {
                        return res.status(200).json({
                            accessToken: createAccessToken(payload._id)
                        })
                    }
                    else {
                        next(ApiError.unauthorized("Invalid refresh Token"))
                        return
                    }
                })
                .catch(err => {
                    console.log(err)
                    next(ApiError.internal("Something went wrong"))
                    return
                })
        }
        catch (err) {
            next(ApiError.unauthorized("Invalid refresh Token"))
            return
        }
    }
    else {
        next(ApiError.internal("Something went wrong"))
        return
    }

}
export const createAccessToken = (_id: string) => {
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        return sign({ _id: _id }, accessTokenSecret, { expiresIn: '15m', issuer: "https://gb-be.de/" })
    }
}
export const createRefreshToken = (_id: string, tokenVersion: number) => {
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        return sign({ _id: _id, tokenVersion: tokenVersion }, refreshTokenSecret, { expiresIn: '168h', issuer: "https://gb-be.de/" })
    }
}

export const revokeRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jid
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        try {
            let payload: any = verify(token, refreshTokenSecret, { issuer: "https://gb-be.de/" })
            const tokenVersion = payload.tokenVersion
            // TODO findoneAndUpdate -> Can we write a better query so we can just use one?
            const user = UserModel.findOne({ _id: payload._id })
                .select("tokenVersion")
                .then(user => {
                    if (user?.tokenVersion === tokenVersion) {
                        try {
                            let newTokenVersion: number = tokenVersion + 1
                            let updatedUser = UserModel.updateOne(
                                { _id: payload._id },
                                { tokenVersion: newTokenVersion }
                            )
                                .then(() => {
                                    return res.status(200).json({
                                        message: "Logged out successfully"
                                    })
                                }
                                )
                        }
                        catch (err) {
                            console.log(err)
                            next(ApiError.internal("Something went wrong"))
                            return
                        }
                    }
                    else {
                        next(ApiError.unauthorized("Invalid refresh token"))
                        return
                    }
                })
                .catch(err => {
                    console.log(err)
                    next(ApiError.internal("Something went wrong"))
                    return
                })
        }
        catch (err) {
            console.log(err)
            next(ApiError.unauthorized("Invalid refresh token"))
            return
        }

    }
}
export const isAuthorizied = (req: Request, res: Response, next: NextFunction) => {
    UserModel.findOne({ _id: res.locals.payload._id })
        .select("role _id")
        .then((UserDoc) => {
            if (UserDoc?.role === "Admin") {
                next()
            }
            else {
                next(ApiError.unauthorized("You are not authorized to perform this action"))
                return
            }
        })

}