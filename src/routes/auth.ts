import express from 'express';
import { createAdmin, isAdmin } from '../controllers/admin';
import { loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
import { confirmUser } from '../controllers/email';
import { authenticateRefreshToken, authenticateToken } from '../controllers/jwt';
import { createAdminValidator, createUserValidator, loginUserValidator } from '../validator/auth';
const router = express.Router();

router.post('/register', createUserValidator, registerUser); 
router.post('/login', loginUserValidator, loginUser);
router.post('/refresh_token', authenticateRefreshToken);
router.post('/logout', authenticateToken, revokeRefreshToken);
router.post('/confirm_email/:confirmationCode', confirmUser);
router.put('/createAdmin', authenticateToken, isAdmin, createAdminValidator, createAdmin);

export default router;
