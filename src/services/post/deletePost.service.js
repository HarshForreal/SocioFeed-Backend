import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const deletePost = async (userId, postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) {
    return {
      status: STATUS.NOT_FOUND,
      body: { message: 'Post not found' },
    };
  }

  if (post.authorId !== userId) {
    return {
      status: STATUS.FORBIDDEN,
      body: { message: 'You are not authorized to delete this post' },
    };
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return {
    status: STATUS.OK,
    body: { message: 'Post deleted successfully' },
  };
};
