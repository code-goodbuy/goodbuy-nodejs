import express from 'express';
import { getProfile, updateProfile } from "../controllers/profile";
import { authenticateToken } from '../controllers/auth';
const router = express.Router();

router.get('/profile', authenticateToken, getProfile)
router.post('/profile', authenticateToken, updateProfile)

export default router;
