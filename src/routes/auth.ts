import express from 'express';
import { authenticateRefreshToken, authenticateToken, loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/refresh_token', authenticateRefreshToken);
router.post('/logout', authenticateToken, revokeRefreshToken);
export default router;
