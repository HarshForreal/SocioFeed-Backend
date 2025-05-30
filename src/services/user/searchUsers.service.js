import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export async function searchUsers(query) {
  if (!query || query.trim() === '') {
    const error = new Error('Search query is required.');
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  // Search by username or bio (case-insensitive, partial match)
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      bio: true,
    },
    take: 20, // limit results for performance
  });

  return {
    status: STATUS.OK,
    users,
  };
}
