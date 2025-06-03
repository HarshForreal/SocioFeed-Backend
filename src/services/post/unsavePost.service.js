import prisma from '../../config/db';
import { STATUS } from '../../utils/responseStatus';
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
