import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    const error = new Error(ERROR_MESSAGES.NO_REFRESH_TOKEN_FOUND);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    error.status = STATUS.FORBIDDEN;
    throw error;
  }

  await prisma.user.update({
    where: { id: decoded.userId },
    data: { refreshToken: null },
  });

  return { status: STATUS.OK, message: ERROR_MESSAGES.LOGGED_OUT_SUCCESSFULLY };
}
