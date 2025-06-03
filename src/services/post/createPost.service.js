import prisma from '../../config/db.js';
export const createPost = async (userId, content, imageUrls) => {
  const post = await prisma.post.create({
    data: {
      content,
      authorId: userId,
      images: {
        create: imageUrls.map((url) => ({ url })),
      },
    },
    include: {
      images: true,
    },
  });

  return post;
};
