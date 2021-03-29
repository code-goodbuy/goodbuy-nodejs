import express from 'express';
import { authenticateRefreshToken, loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/refresh_token', authenticateRefreshToken);
router.post('/revoke_refresh_token', revokeRefreshToken);
export default router;
