import prisma from '../../config/db.js';

export const getFeed = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followeeId: true },
  });

  const ids = following.map((f) => f.followeeId).concat(userId);

  const posts = await prisma.post.findMany({
    where: { authorId: { in: ids } },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      images: true,
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  return posts;
};
