import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const editComment = async (commentId, userId, content) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });
  if (!comment) {
    return {
      status: STATUS.NOT_FOUND,
      body: { message: 'Comment not found' },
    };
  }
  if (comment.authorId !== userId) {
    return {
      status: STATUS.FORBIDDEN,
      body: { message: 'You are not allowed to edit this comment' },
    };
  }
  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
  return { status: STATUS.OK, body: updated };
};
