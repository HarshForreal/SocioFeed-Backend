import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const addComment = async (userId, postId, content) => {
  if (!content) {
    return {
      status: STATUS.BAD_REQUEST,
      body: { message: 'Comment cannot be empty' },
    };
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
    include: {
      author: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });

  return { status: STATUS.CREATED, body: newComment };
};
