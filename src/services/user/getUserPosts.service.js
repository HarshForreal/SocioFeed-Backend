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

  // In your getUserPosts function (backend):
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
      likes: { select: { userId: true } }, // Fetch the likes along with the post
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
    likesCount: post.likes.length, // Calculate likes count here
    commentsCount: post.comments.length, // Calculate comments count here
    author: post.author,
  }));

  return {
    status: STATUS.OK,
    posts: formattedPosts,
  };
}
