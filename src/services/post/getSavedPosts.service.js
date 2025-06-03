import prisma from '../../config/db.js';

export const getSavedPosts = async (userId, skip = 0, take = 10) => {
  const savedPosts = await prisma.savedPost.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        include: {
          author: {
            select: { id: true, username: true, avatarUrl: true },
          },
          images: true,
          likes: true,
          comments: true,
        },
      },
    },
  });

  // Map savedPost entries to their post objects
  return savedPosts.map((saved) => saved.post);
};
