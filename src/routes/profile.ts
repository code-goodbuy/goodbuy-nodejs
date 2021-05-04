import express from 'express';
import { getProfile, updateProfile, getOtherProfile } from "../controllers/profile";
import { authenticateToken } from '../controllers/auth';
import { updateProfileValidator } from '../validator/profile';
const router = express.Router();

// own profile
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', updateProfileValidator, authenticateToken, updateProfile)
// other profile
router.get('/profile/:username', getOtherProfile)

export default router;
