import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const likePost = async (userId, postId) => {
  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
    return {
      status: STATUS.OK,
      body: { message: 'Post unliked' },
    };
  } else {
    await prisma.like.create({ data: { postId, userId } });
    return {
      status: STATUS.OK,
      body: { message: 'Post liked' },
    };
  }
};
