import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";
const ApiError = require('../error/ApiError');

export const getOtherProfile = (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.params.username
  UserModel.findOne({ username: username })
    .then((user) => {
      if (user === null) {
        next(ApiError.conflict("user does not exist"))
        return
      } else if (user) {
        return res.status(200).json({
          _id: user.id,
          email: user.email,
          description: user.description,
          imageURL: user.imageURL
        })
      } 
    })
    .catch((err: Error) => {
      next(ApiError.internal("Something went wrong"))
      return
    })
}
