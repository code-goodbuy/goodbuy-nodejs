import UserModel from "../models/user.model";
import { Request, Response, NextFunction } from 'express';

const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // TODO change this to the vercel domain
  export const sendConfirmationEmail = (username: string, email: string, confirmationCode: string) => {
      console.log("Check");
      transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello ${username}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:8080/confirm_email/${confirmationCode}> Click here</a>
            </div>`,
      }).catch((err: Error) => console.log(err));
    };
  
  export const confirmUser = (req: Request, res: Response) => {
      console.log(req.params.confirmationCode)
      UserModel.findOne({
          confirmationCode: req.params.confirmationCode,
        })
          .then((user) => {
            if (!user) {
              return res.status(404).send({ message: "User Not found." });
            }
      
            user.active = true;
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
            });
          })
          .catch((e) => console.log("error", e));
  }