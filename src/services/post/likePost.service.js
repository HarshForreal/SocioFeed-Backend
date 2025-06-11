import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const likePost = async (userId, postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      likes: true,
    },
  });

  if (!post) {
    return {
      status: STATUS.NOT_FOUND,
      body: { message: 'Post not found' },
    };
  }

  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  let updatedLikes;

  if (existing) {
    await prisma.like.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });

    updatedLikes = await prisma.like.findMany({ where: { postId } });

    return {
      status: STATUS.OK,
      body: {
        message: 'Post unliked',
        likesCount: updatedLikes.length,
        likes: updatedLikes,
      },
    };
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });

    updatedLikes = await prisma.like.findMany({ where: { postId } });

    return {
      status: STATUS.OK,
      body: {
        message: 'Post liked',
        likesCount: updatedLikes.length,
        likes: updatedLikes,
      },
    };
  }
};
