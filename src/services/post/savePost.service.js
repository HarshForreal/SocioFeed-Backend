import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const savePost = async (userId, postId) => {
  await prisma.savedPost.upsert({
    where: {
      postId_userId: { postId, userId },
    },
    update: {},
    create: { postId, userId },
  });

  return {
    status: STATUS.OK,
    body: { message: 'Post saved' },
  };
};

export const unsavePost = async (userId, postId) => {
  await prisma.savedPost.delete({
    where: {
      postId_userId: { postId, userId },
    },
  });

  return {
    status: STATUS.OK,
    body: { message: 'Post unsaved' },
  };
};
