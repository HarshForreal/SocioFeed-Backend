import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import nodemailer from 'nodemailer';
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
} from '../utils/validation.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register User
export const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!isValidUsername(username)) {
      return res
        .status(400)
        .json({ message: 'Username must be alphanumeric.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          'Password must be minimum 8 characters with uppercase, lowercase, number, and symbol.',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if username or email exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user inactive
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, isActive: false },
    });

    // Generate activation token (expires in 1 day)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Send activation email
    const activationLink = `${process.env.FRONTEND_URL}/activate/${token}`;
    await transporter.sendMail({
      from: `"SocioFeed" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Activate your SocioFeed account',
      html: `<p>Hello ${user.username},</p>
             <p>Please click <a href="${activationLink}">here</a> to activate your account. This link expires in 24 hours.</p>`,
    });

    res.status(201).json({
      message:
        'Registration successful. Please check your email to activate your account.',
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Activate Account
export const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isActive: true },
    });
    res.json({ message: 'Account activated successfully.' });
  } catch (err) {
    console.error('Activation error:', err);
    res.status(400).json({ message: 'Invalid or expired activation token.' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ message: 'Username/email and password are required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is not activated.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m', // short-lived access token
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '7d', // longer lived refresh token
      },
    );

    // Save refresh token to DB for the user
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Send tokens to client (usually access token in body, refresh token in HTTP-only cookie)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Request Password Reset (send reset link)
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ message: 'User with that email does not exist.' });

    // Generate reset token (expires in 1 hour)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"SocioFeed" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'SocioFeed Password Reset',
      html: `<p>Hello ${user.username},</p>
             <p>Please click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });

    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Reset Password (using token)
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  try {
    if (!newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: 'Both password fields are required.' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be minimum 8 characters with uppercase, lowercase, number, and symbol.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: 'Refresh token missing' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Refresh token not recognized' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    // Optional: rotate refresh token
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '7d',
      },
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
