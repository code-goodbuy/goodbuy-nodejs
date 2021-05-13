import UserModel from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import client from 'prom-client';
import { sendConfirmationEmail } from './email';

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

export const registerUser = (req: Request, res: Response) => {
    if(!req.body.acceptedTerms || !req.body.hasRequiredAge){return res.status(400).json({message: "You have to agree to our term of condition and have the required age to register as user!"})}
    UserModel.findOne({ email: req.body.email })
        .select("_id")
        .then(userDoc => {
            if (userDoc) return res.status(409).json({
                message: "User does not exist or password/email is wrong"
            })
            UserModel.findOne({ username: req.body.username})
            .select("_id")
            .then(userDoc => {
                if (userDoc) return res.status(409).json({
                    message: "User does not exist or password/email is wrong"
                })
            let password: string = req.body.password
            const saltRounds: number = 10;
            bcrypt.hash(password, saltRounds, function (err: Error, hash: String) {
                if (err) return res.status(500).json({
                    message: "Something went wrong"
                });
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
                            return res.status(500).json({
                                message: "Something went wrong"
                            })
                        })
                        .catch((err: Error) => {
                            console.log(err)
                            return res.status(500).json({
                                message: "Something went wrong"
                            })
                        });
                }
                else {
                    console.log("Confirmation secret not found")
                    return res.status(500).json({
                        message: "Something went wrong"
                    })
                }
            })
        })
        .catch((err: Error) => {
            console.log(err)
            return res.status(500).json({
                message: "Something went wrong"
            })
        });
    })
}

export const loginUser = (req: Request, res: Response) => {
    const email: string = req.body.email
    const password: string = req.body.password
    UserModel.findOne({ email: email })
        .select("username description imageURL tokenVersion active password")
        .then(user => {
            if (user === null) {
                return res.status(409).json({ message: "User does not exist or password/email is wrong" })
            }
            if (user.tokenVersion == null) {
                return res.status(400).json({ message: "Missing Token Version" })
            }
            if (user.active != true) {
                return res.status(401).send({
                    message: "Pending Account. Please Verify Your Email!",
                });
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
                    return res.status(409).json({ message: "User does not exist or password/email is wrong" })
                }
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Something went wrong" })
        }
        );
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({ message: "JWT is missing, access denied" })
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        try {
            let payload: any = null
            payload = verify(token, accessTokenSecret)
            if (payload) {
                res.locals.payload = payload;
                next()
            }
        }
        catch (err) {
            return res.status(401).json({ message: "Invalid Access Token" })
        }

    }
}

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jid;
    if (token == null) return res.status(401).json({ message: "Invalid refresh Token" })
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        try {
            let payload: any = verify(token, refreshTokenSecret)
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
                        return res.status(401).json({ message: "Invalid refresh Token" })
                    }
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({ message: "Something went wrong"})
                })
        }
        catch (err) {
            return res.status(401).json({ message: "Invalid refresh Token" })
        }
    }
    else{
        return res.status(500).json({ message: "Something went wrong"})
    }

}
export const createAccessToken = (_id: string) => {
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        return sign({ _id: _id }, accessTokenSecret, { expiresIn: '5m' })
    }
}
export const createRefreshToken = (_id: string, tokenVersion: number) => {
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        return sign({ _id: _id, tokenVersion: tokenVersion }, refreshTokenSecret, { expiresIn: '168h' })
    }
}

export const revokeRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jid
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        try {
            let payload: any = verify(token, refreshTokenSecret)
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
                            return res.status(500).json({
                                message: "Something went wrong"
                            })
                        }
                    }
                    else {
                        return res.status(401).json({ message: "Invalid refresh token" })
                    }
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({ message: "Something went wrong" })
                })
        }
        catch (err) {
            console.log(err)
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }

    }
}
export const isAuthorizied = (req: Request, res: Response,  next: NextFunction) => {
    UserModel.findOne({_id: res.locals.payload._id})
    .select("role _id")
    .then(( UserDoc )=> {
        if(UserDoc?.role === "Admin"){
            next()
        }
        else {
            return res.status(401).json({ message: "You are not authorized to perform this action"})
        }
    })

}