import { sign, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
const ApiError = require('../error/ApiError');

export const createAccessToken = (_id: string, isAdmin: boolean) => {
    if (process.env.ACCESS_TOKEN_SECRET) {
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
        return sign({ _id: _id, isAdmin: isAdmin }, accessTokenSecret, { expiresIn: '15m', issuer: "https://gb-be.de/" })
    }
}
export const createRefreshToken = (_id: string, tokenVersion: number, isAdmin: boolean) => {
    if (process.env.REFRESH_TOKEN_SECRET) {
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET
        return sign({ _id: _id, tokenVersion: tokenVersion, isAdmin: isAdmin }, refreshTokenSecret, { expiresIn: '168h', issuer: "https://gb-be.de/" })
    }
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
            UserModel.findOne({ _id: payload._id })
                .select("tokenVersion")
                .then(user => {
                    if (user?.tokenVersion === tokenVersion) {
                        return res.status(200).json({
                            accessToken: createAccessToken(payload._id, false)
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