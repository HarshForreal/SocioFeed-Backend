import prisma from '../../config/db.js';

export const editUserProfile = async (userId, data) => {
  try {
    const updateData = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        email: true,
      },
    });

    return {
      status: 200,
      updatedUser,
    };
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};
