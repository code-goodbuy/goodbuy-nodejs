import express from 'express';
import { authenticateRefreshToken, authenticateToken, loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
import { confirmUser } from '../controllers/email';
const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/refresh_token', authenticateRefreshToken);
router.post('/logout', authenticateToken, revokeRefreshToken);
router.post('/confirm_email/:confirmationCode', confirmUser);
export default router;
