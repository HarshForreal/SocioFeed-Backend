import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function verifyUser(refreshToken) {
  if (!refreshToken) {
    const error = new Error(ERROR_MESSAGES.REFRESH_TOKEN_MISSING);
    error.status = STATUS.UNAUTHORIZED;
    throw error;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      error.status = STATUS.NOT_FOUND;
      throw error;
    }

    return { status: STATUS.OK, user };
  } catch (err) {
    const error = new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    error.status = STATUS.UNAUTHORIZED;
    throw error;
  }
}
