import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function getUserPosts(userId, { skip = 0, take = 10 } = {}) {
  // Validate pagination parameters if needed

  // Check if user exists and is active
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });

  if (!user || !user.isActive) {
    const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    error.status = STATUS.NOT_FOUND;
    throw error;
  }

  // Fetch posts with related data
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      images: { select: { url: true } },
      likes: { select: { userId: true } },
      comments: { select: { id: true } },
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Map posts to cleaner format
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    images: post.images.map((img) => img.url),
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    author: post.author,
  }));

  return {
    status: STATUS.OK,
    posts: formattedPosts,
  };
}
