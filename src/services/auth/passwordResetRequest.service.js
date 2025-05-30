import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { transporter } from '../../config/email.config.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function requestPasswordReset(email) {
  if (!email) {
    const error = new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error(ERROR_MESSAGES.USER_WITH_EMAIL_NOT_FOUND);
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

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

  return {
    status: STATUS.OK,
    message: ERROR_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
  };
}
