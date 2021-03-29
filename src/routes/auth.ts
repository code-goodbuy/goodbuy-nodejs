import express from 'express';
import { authenticateToken, loginUser, registerUser } from '../controllers/auth';
const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/refresh_token', authenticateToken);
export default router;
