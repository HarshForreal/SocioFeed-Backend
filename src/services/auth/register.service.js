import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { transporter } from '../../config/email.config.js';
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
} from '../../utils/validation.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function registerUser({
  username,
  email,
  password,
  confirmPassword,
}) {
  if (!username || !email || !password || !confirmPassword) {
    const error = new Error(ERROR_MESSAGES.REQUIRED_FIELDS);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (!isValidUsername(username)) {
    const error = new Error(ERROR_MESSAGES.INVALID_USERNAME);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (!isValidEmail(email)) {
    const error = new Error(ERROR_MESSAGES.INVALID_EMAIL);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (!isValidPassword(password)) {
    const error = new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (password !== confirmPassword) {
    const error = new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existingUser) {
    const error = new Error(ERROR_MESSAGES.USER_EXISTS);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword, isActive: false },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const activationLink = `${process.env.FRONTEND_URL}/activate/${token}`;

  await transporter.sendMail({
    from: `"SocioFeed" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Activate your SocioFeed account',
    html: `<p>Hello ${user.username},</p>
           <p>Please click <a href="${activationLink}">here</a> to activate your account. This link expires in 24 hours.</p>`,
  });

  return {
    status: STATUS.CREATED,
    message: ERROR_MESSAGES.REGISTRATION_SUCCESS,
  };
}
