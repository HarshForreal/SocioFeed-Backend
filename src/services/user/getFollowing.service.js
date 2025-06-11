import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function getFollowing(userId) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      followee: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          bio: true,
        },
      },
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!following) {
    const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    error.status = STATUS.NOT_FOUND;
    throw error;
  }

  const followingList = following.map((f) => ({
    id: f.followee.id,
    username: f.followee.username,
    avatarUrl: f.followee.avatarUrl,
    bio: f.followee.bio,
    followedAt: f.createdAt,
  }));

  return {
    status: STATUS.OK,
    following: followingList,
  };
}
