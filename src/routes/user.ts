import express from 'express';
import { getOtherProfile } from "../controllers/profile";
// import { authenticateToken } from '../controllers/auth';
// import { updateProfileValidator } from '../validator/profile';
const router = express.Router();

router.get('/user/:username', getOtherProfile)

export default router;
