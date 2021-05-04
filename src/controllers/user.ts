import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";

export const getOtherProfile = (req: Request, res: Response, next: NextFunction) => {
  UserModel.findOne({ username: req.params.username })
    .then((user) => {
      if (user) {
        return res.status(200).json({
          _id: user.id,
          email: user.email,
          description: user.description,
          imageURL: user.imageURL
        })
      } else {
        return res.status(503).json({
          message: "data not found"
        })
      }
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "internal error" })
    })
}
