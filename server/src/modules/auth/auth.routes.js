import express from 'express';
import { sendOtp, login, logout, getMe, getDemoAccounts, registerSelf } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/register', registerSelf);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.get('/demo-accounts', getDemoAccounts);

export default router;

