import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function getFollowers(userId) {
  const followers = await prisma.follow.findMany({
    where: { followeeId: userId },
    select: {
      follower: {
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

  if (!followers) {
    const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    error.status = STATUS.NOT_FOUND;
    throw error;
  }

  // Map followers to simpler format
  const followerList = followers.map((f) => ({
    id: f.follower.id,
    username: f.follower.username,
    avatarUrl: f.follower.avatarUrl,
    bio: f.follower.bio,
    followedAt: f.createdAt,
  }));

  return {
    status: STATUS.OK,
    followers: followerList,
  };
}
