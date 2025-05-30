import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function refreshToken(oldToken) {
  if (!oldToken) {
    const error = new Error(ERROR_MESSAGES.REFRESH_TOKEN_MISSING);
    error.status = STATUS.UNAUTHORIZED;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    error.status = STATUS.FORBIDDEN;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });
  if (!user || user.refreshToken !== oldToken) {
    const error = new Error(ERROR_MESSAGES.REFRESH_TOKEN_NOT_RECOGNIZED);
    error.status = STATUS.FORBIDDEN;
    throw error;
  }

  const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const newRefreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return { status: STATUS.OK, newAccessToken, newRefreshToken };
}
