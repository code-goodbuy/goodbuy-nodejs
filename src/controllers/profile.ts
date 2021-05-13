import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";



export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const payload = res.locals.payload;
  UserModel.findOne({ _id: payload._id })
    .then((user) => {
      if (user) {
        return res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          description: user.description,
          imageURL: user.imageURL,
        })
      } else {
        return res.status(409).json({
          message: "user credential is wrong"
        })
      }
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: 'Something went wrong' })
    });
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, description, imageURL } = req.body;

  const payload = res.locals.payload;

  UserModel.findOneAndUpdate(
    // filter, update, option
    { _id: payload._id },
    { description: description, imageURL: imageURL },
    { new: true, useFindAndModify: false, upsert: true },
    (err, results) => {
      if (results) {
        res.status(200).json({
          _id: results._id,
          username: results.username,
          description: results.description,
          imageURL: results.imageURL
        });
      } else {
        return res.status(409).json({
          message: "User credential is wrong",
        });
      }
    }
  ).catch((err: Error) => {
    console.log(err);
    return res.status(501).json({ message: "Something went wrong" })
  });
};
