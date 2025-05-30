import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export async function editUserProfile(userId, { username, bio, avatarUrl }) {
  // Basic validation (you can expand as needed)
  if (!username) {
    const error = new Error('Username is required.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  // Check if username is taken by another user
  const existingUser = await prisma.user.findFirst({
    where: {
      username,
      NOT: { id: userId },
    },
  });

  if (existingUser) {
    const error = new Error('Username already taken.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      bio,
      avatarUrl,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      bio: true,
      avatarUrl: true,
      updatedAt: true,
    },
  });

  return {
    status: STATUS.OK,
    updatedUser,
  };
}
