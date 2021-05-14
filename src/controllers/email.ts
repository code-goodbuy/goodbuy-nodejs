import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from 'express';
const ApiError = require('../error/ApiError');

const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  export const sendConfirmationEmail = (username: string, email: string, confirmationCode: string) => {
      transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello ${username}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=https://goodbuy.vercel.app/verify?token=${confirmationCode}> Click here</a>
            </div>`,
      }).catch((err: Error) => {console.log(err)});
    };
  //TODO validate confirmation code
  export const confirmUser = (req: Request, res: Response, next: NextFunction) => {
    // TODO check if this selection over rides or just updates
      UserModel.findOne({
          confirmationCode: req.params.confirmationCode,
        })
          .select("_id active")
          .then((user) => {
            if (!user) {
              next(ApiError.notFound("User Not found."))
              return
            }
            user.active = true;
            user.save((err) => {
              if (err) {
                console.log(err)
                next(ApiError.internal("Something went wrong"))
                return;
              }
              res.status(200).send({ message: "Successfully activated account!"})
            });
          })
          .catch((e) => console.log("error", e));
  }