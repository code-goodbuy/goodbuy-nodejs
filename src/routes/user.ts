import express from 'express';
import { getOtherProfile } from "../controllers/user";
import { findUserValidator } from "../validator/user";
const router = express.Router();

router.get('/user/:username', findUserValidator, getOtherProfile)

export default router;
