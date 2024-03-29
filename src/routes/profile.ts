import express from 'express';
import { getProfile, updateProfile } from "../controllers/profile";
import { authenticateToken } from '../controllers/jwt';
import { updateProfileValidator } from '../validator/profile';
const router = express.Router();


router.get('/profile', authenticateToken, getProfile)
router.put('/profile', updateProfileValidator, authenticateToken, updateProfile)

export default router;
