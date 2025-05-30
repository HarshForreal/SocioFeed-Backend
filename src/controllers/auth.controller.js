import * as registerService from '../services/auth/register.service.js';
import * as loginService from '../services/auth/login.service.js';
import * as activateService from '../services/auth/activate.service.js';
import * as passwordResetRequestService from '../services/auth/passwordResetRequest.service.js';
import * as passwordResetService from '../services/auth/passwordReset.service.js';
import * as refreshTokenService from '../services/auth/refreshToken.service.js';
import * as logoutService from '../services/auth/logout.service.js';
import * as verifyUserService from '../services/auth/verifyUser.service.js';

import { ERROR_MESSAGES } from '../utils/errorMessages.js';

export const registerUser = async (req, res) => {
  try {
    const result = await registerService.registerUser(req.body);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Register error:');
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { accessToken, refreshToken, user, status } =
      await loginService.loginUser(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(status).json({ token: accessToken, user });
  } catch (err) {
    console.error('Login error:');
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const activateAccount = async (req, res) => {
  try {
    const result = await activateService.activateAccount(req.params.token);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Activation error');
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const result = await passwordResetRequestService.requestPasswordReset(
      req.body.email
    );
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Password reset request error:');
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await passwordResetService.resetPassword(
      req.params.token,
      req.body
    );
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Password reset error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    const { status, newAccessToken, newRefreshToken } =
      await refreshTokenService.refreshToken(oldToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(status).json({ token: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await logoutService.logoutUser(token);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Logout error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await verifyUserService.vcerifyUser(token);
    res.status(result.status).json({ user: result.user });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};
