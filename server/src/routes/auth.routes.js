import express from 'express';
import { signup, login, getMe, forgotPassword, resetPassword, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, updateProfile);

export default router;