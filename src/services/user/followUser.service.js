import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export async function followUser(followerId, followeeId) {
  if (followerId === followeeId) {
    const error = new Error('You cannot follow yourself.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followeeId: {
        followerId,
        followeeId,
      },
    },
  });

  if (existingFollow) {
    const error = new Error('You are already following this user.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const userToFollow = await prisma.user.findUnique({
    where: { id: followeeId },
    select: { isActive: true },
  });

  if (!userToFollow || !userToFollow.isActive) {
    const error = new Error('User to follow does not exist or is inactive.');
    error.status = STATUS.NOT_FOUND;
    throw error;
  }

  await prisma.follow.create({
    data: {
      followerId,
      followeeId,
    },
  });

  return { status: STATUS.OK, message: 'Successfully followed the user.' };
}
