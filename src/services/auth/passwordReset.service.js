import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { isValidPassword } from '../../utils/validation.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function resetPassword(
  token,
  { newPassword, confirmNewPassword }
) {
  if (!newPassword || !confirmNewPassword) {
    const error = new Error(ERROR_MESSAGES.PASSWORD_FIELDS_REQUIRED);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (newPassword !== confirmNewPassword) {
    const error = new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
  if (!isValidPassword(newPassword)) {
    const error = new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return {
      status: STATUS.OK,
      message: ERROR_MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  } catch (err) {
    const error = new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }
}
