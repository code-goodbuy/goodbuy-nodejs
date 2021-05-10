import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";


// TODO add api doc to swagger

// TODO UPDATE PROFILE QUERIES WITH USER ID INSTAED OF EMAIL
export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const payload = res.locals.payload;
  UserModel.findOne({ email: payload.email })
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
      return res.status(500).json({ message: 'internal error' })
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
    { email: email },
    { description: description, imageURL: imageURL },
    { new: true, useFindAndModify: false, upsert: true },
    (err, results) => {
      if (results && payload.email === req.body.email) {
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
    return res.status(501).json({ message: "internal server error" })
  });
};
