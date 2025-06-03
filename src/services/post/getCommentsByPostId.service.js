import prisma from '../../config/db.js';

export const getCommentsByPostId = async (postId) => {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};
