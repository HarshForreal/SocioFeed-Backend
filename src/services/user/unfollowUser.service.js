import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export async function unfollowUser(followerId, followeeId) {
  if (followerId === followeeId) {
    const error = new Error('You cannot unfollow yourself.');
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

  if (!existingFollow) {
    const error = new Error('You are not following this user.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  await prisma.follow.delete({
    where: {
      followerId_followeeId: {
        followerId,
        followeeId,
      },
    },
  });

  return { status: STATUS.OK, message: 'Successfully unfollowed the user.' };
}
