import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export async function searchUsers(query, currentUserId) {
  if (!query || query.trim() === '') {
    const error = new Error('Search query is required.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ],
      NOT: { id: currentUserId }, // optional: don't return current user
    },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      bio: true,
      followers: {
        where: {
          followerId: currentUserId,
        },
        select: { id: true },
      },
    },
    take: 20,
  });

  // Map follow status
  const result = users.map((user) => ({
    ...user,
    isFollowing: user.followers.length > 0,
  }));

  return {
    status: STATUS.OK,
    users: result,
  };
}
