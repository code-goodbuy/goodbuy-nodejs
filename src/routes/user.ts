import express from 'express';
import { getOtherProfile } from "../controllers/profile";
const router = express.Router();

router.get('/user/:username', getOtherProfile)

export default router;
