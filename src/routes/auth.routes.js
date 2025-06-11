import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/activate/:token', authController.activateAccount);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logoutUser);
router.get('/verify', authController.verifyUser);

export default router;
