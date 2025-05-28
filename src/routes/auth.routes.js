import express from 'express';
import {
  registerUser,
  activateAccount,
  loginUser,
  requestPasswordReset,
  resetPassword,
  refreshToken,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/activate/:token', activateAccount);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);

export default router;
