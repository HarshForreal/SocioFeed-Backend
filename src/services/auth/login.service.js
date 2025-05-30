// services/auth.service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export async function loginUser({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    const error = new Error('Username/email and password are required.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
  });

  if (!user) {
    const error = new Error('User not found.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (!user.isActive) {
    const error = new Error('Account is not activated.');
    error.status = STATUS.FORBIDDEN;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    status: STATUS.OK,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}
