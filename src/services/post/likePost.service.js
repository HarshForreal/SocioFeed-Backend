import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';

export const likePost = async (userId, postId) => {
  // Check if post exists (optional but safe)
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      likes: true, // get updated likes
    },
  });

  if (!post) {
    return {
      status: STATUS.NOT_FOUND,
      body: { message: 'Post not found' },
    };
  }

  // Check if user already liked
  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  let updatedLikes;

  if (existing) {
    // Unlike
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
    // Like
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
