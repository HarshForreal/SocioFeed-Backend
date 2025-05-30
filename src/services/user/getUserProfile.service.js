import prisma from '../../config/db.js';
import { STATUS } from '../../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

export async function getUserProfile(identifier) {
  // identifier can be username or userId
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { id: identifier }],
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      email: false,
      bio: true,
      avatarUrl: true,
      createdAt: true,

      followers: {
        select: { followerId: true },
      },
      following: {
        select: { followeeId: true },
      },
      posts: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          images: { select: { url: true } },
          likes: true,
          comments: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!user) {
    const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    error.status = STATUS.NOT_FOUND;
    throw error;
  }

  // Prepare follower and following counts
  const followerCount = user.followers.length;
  const followingCount = user.following.length;

  // Prepare posts count and simplified posts data
  const postsCount = user.posts.length;
  const posts = user.posts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    images: post.images.map((img) => img.url),
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
  }));

  return {
    status: STATUS.OK,
    userProfile: {
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      followerCount,
      followingCount,
      postsCount,
      posts,
    },
  };
}
