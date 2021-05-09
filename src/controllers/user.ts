import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";

export const getOtherProfile = (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.params.username
  UserModel.findOne({ username: username })
    .then((user) => {
      if (user === null) {
        return res.status(409).json({ message: "user does not exist" })
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
      return res.status(500).json({ message: "internal error" })
    })
}
