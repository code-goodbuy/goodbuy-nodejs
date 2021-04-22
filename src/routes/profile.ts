import express from 'express';
import { updateProfile } from "../controllers/profile";
import { authenticateRefreshToken, authenticateToken, loginUser, registerUser, revokeRefreshToken } from '../controllers/auth';
// import { confirmUser } from '../controllers/email';
// import { createUserValidator, loginUserValidator } from '../validator/auth';
const router = express.Router();

// router.post('/register', createUserValidator, registerUser); 
// router.post('/login', loginUserValidator, loginUser);
// router.post('/refresh_token', authenticateRefreshToken);
// router.post('/logout', authenticateToken, revokeRefreshToken);
// router.post('/confirm_email/:confirmationCode', confirmUser);
router.post('/profile', updateProfile)

export default router;
