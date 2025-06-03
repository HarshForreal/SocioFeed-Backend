import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const deleteComment = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      authorId: true,
      post: {
        select: { authorId: true },
      },
    },
  });

  if (!comment) {
    return {
      status: STATUS.NOT_FOUND,
      body: { message: 'Comment not found' },
    };
  }

  const isCommenter = comment.authorId === userId;
  const isPostOwner = comment.post.authorId === userId;

  if (!isCommenter && !isPostOwner) {
    return {
      status: STATUS.FORBIDDEN,
      body: { message: 'You are not authorized to delete this comment' },
    };
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return {
    status: STATUS.OK,
    body: { message: 'Comment deleted successfully' },
  };
};
