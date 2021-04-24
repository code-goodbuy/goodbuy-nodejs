import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";

// TODO add api doc to swagger
// TODO better statuscode for error handling
// NOTE should profile page have param route?

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = new UserModel({
    email: email,
  });
  UserModel.find({ email: email }, function (err, results) {
    return res
      .status(200)
      .send({ message: "profile received", results: results });
  })
    .select("username email description imageURL")
    .then((success) => {
      if (success) {
      } else {
        return res.status(500).json({
          message: "internal error",
        });
      }
    })
    .catch((err: Error) => {
      console.log(err);
    });
};

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
    { new: true, useFindAndModify: false, multi: true },
    (err, results) => {
      if (results) {
        res.status(200).json({
          message: "profile updated",
          results: {
            _id: results._id,
            username: results.username,
            email: results.email,
            description: results.description,
            imageURL: results.imageURL
          },
        });
      } else {
        return res.status(500).json({
          message: "internal error",
        });
      }
    }
  ).catch((err: Error) => {
    console.log(err);
  });
};
