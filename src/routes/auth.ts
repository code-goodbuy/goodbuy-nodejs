import express from 'express';
import { authenticateRefreshToken, authenticateToken, loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
import { createUserValidator, loginUserValidator } from '../validator/auth';
const router = express.Router();

router.post('/register', createUserValidator, registerUser); 
router.post('/login', loginUserValidator, loginUser);
router.post('/refresh_token', authenticateRefreshToken);
router.post('/logout', revokeRefreshToken);
export default router;
