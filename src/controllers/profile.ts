import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { sign, verify } from 'jsonwebtoken';


// TODO add api doc to swagger

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const payload = res.locals.payload;

  UserModel.findOne({ email: email })
    .then((user) => {
      if (user && email === payload.email) {
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
      return res.status(500).json({ message: 'internal error'})
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

// export const authenticateEmailAndToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.status(401).json({ message: "JWT is missing, access denied" })
//   if (process.env.ACCESS_TOKEN_SECRET) {
//       const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET
//       try {
//           let payload: any = null
//           payload = verify(token, accessTokenSecret)
//           if (payload.email === req.body.email) {
//               next()
//           } else {
//             return res.status(409).json({
//               message: "User credential is wrong"
//             })
//           }
//       }
//       catch (err) {
//           console.log(err)
//           return res.status(401).json({ message: "Invalid Access Token" })
//       }

//   }
// }