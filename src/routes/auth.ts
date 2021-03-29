import express from 'express';
import { authenticateToken, loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/refresh_token', authenticateToken);
router.post('/revoke_refresh_token', revokeRefreshToken);
export default router;
