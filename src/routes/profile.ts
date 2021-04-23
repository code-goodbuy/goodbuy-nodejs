import express from 'express';
import { updateProfile } from "../controllers/profile";
import { authenticateToken } from '../controllers/auth';
const router = express.Router();

router.post('/profile', authenticateToken, updateProfile)

export default router;
