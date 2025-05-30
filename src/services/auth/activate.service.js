import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function activateAccount(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isActive: true },
    });

    return { status: STATUS.OK, message: ERROR_MESSAGES.ACCOUNT_ACTIVATED };
  } catch (err) {
    const error = new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
}
