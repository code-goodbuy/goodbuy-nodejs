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

export const registerUser = (req: Request, res: Response) => {

    // we have to send a email that bestätigt that it is ur email
    // send better responses 
    const email: string = req.body.email;
    const password: string = req.body.password;
    // Should probably also check if username already exists but that is not important right now
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
                // TODO add this on EC2 and travis
                let confirmationCode = ""
                if (process.env.EMAIL_CONFIRMATION_SECRET) {
                    confirmationCode = sign({ email: req.body.email }, process.env.EMAIL_CONFIRMATION_SECRET)
                    const user = new UserModel({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        acceptedTerms: req.body.acceptedTerms,
                        hasRequiredAge: req.body.hasRequiredAge,
                        tokenVersion: 0,
                        active: false,
                        confirmationCode: confirmationCode
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
                                message: "internal server error"
                            })
                        })
                        .catch((err: Error) => (console.log(err)));
                }
                else {
                    console.log("Confirmation secret not found")
                }
            })
        })
        .catch((err: Error) => console.log(err));
}

export const loginUser = (req: Request, res: Response) => {
    const email: string = req.body.email
    const password: string = req.body.password
    UserModel.findOne({ email: email })
        .then(user => {
            if (user === null) {
                return res.status(409).json({ message: "User does not exist or password/email is wrong" })
            }
            if (user.tokenVersion == null) {
                return res.status(401).json({ message: "Missing Token Version" })
            }
            if (user.active != true) {
                return res.status(401).send({
                    message: "Pending Account. Please Verify Your Email!",
                });
            }
            bcrypt.compare(password, user.password, function (err: Error, result: Boolean) {
                if (result) {
                    res.cookie('jid', createRefreshToken(email, user.tokenVersion),
                        {
                            httpOnly: true,
                        })
                    const accessToken = createAccessToken(email)
                    return res.status(200).json(
                        {
                            "username": user.username,
                            // "email": user.email,
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
        try {
            let payload: any = null
            payload = verify(token, accessTokenSecret)
            if (payload) {
                next()
            }
        }
        catch (err) {
            console.log(err)
            return res.status(401).json({ message: "Invalid Access Token" })
        }

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
            const tokenVersion = payload.tokenVersion
            const user = UserModel.findOne({ email: payload.email })
                .then(user => {
                    if (user?.tokenVersion === tokenVersion) {
                        return res.status(200).json({
                            accessToken: createAccessToken(payload.email)
                        })
                    }
                    else {
                        return res.status(401).json({ message: "Invalid refresh token version" })
                    }
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({ message: "Internal server error" })
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
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        return sign({ email: email, tokenVersion: tokenVersion }, refreshTokenSecret, { expiresIn: '168h' })
    }
}

export const revokeRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jid
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        try {
            let payload: any = verify(token, refreshTokenSecret)
            const tokenVersion = payload.tokenVersion
            const user = UserModel.findOne({ email: payload.email })
                .then(user => {
                    if (user?.tokenVersion === tokenVersion) {
                        try {
                            let newTokenVersion: number = tokenVersion + 1
                            console.log(newTokenVersion)
                            let updatedUser = UserModel.updateOne(
                                { email: payload.email },
                                { tokenVersion: newTokenVersion }
                            )
                                .then(() => {
                                    return res.status(200).json({
                                        message: "Revoked refresh_token successfully"
                                    })
                                }
                                )
                        }
                        catch (err) {
                            console.log(err)
                            return res.status(500).json({
                                message: "Problem with revoking the token"
                            })
                        }
                    }
                    else {
                        return res.status(401).json({ message: "Invalid refresh token version" })
                    }
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({ message: "Internal server error" })
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
