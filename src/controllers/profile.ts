import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, description, imageURL } = req.body;
  const user = new UserModel({
    description: description,
    imageURL: imageURL,
  });
  UserModel.findOneAndUpdate(
    // filter, update, option
    { email: email },
    { description: description, imageURL: imageURL },
    { new: true, useFindAndModify: false, multi: true }
  )
    .then((success) => {
      return res.status(200).json({
        message: "profile updated",
      });
    })
    .catch((err: Error) => {
      console.log(err);
    });
};
