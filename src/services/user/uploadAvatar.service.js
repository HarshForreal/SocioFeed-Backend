import cloudinary from '../../config/cloudinary.js';
import prisma from '../../config/db.js';

export const uploadAvatarService = async (fileBuffer, userId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'avatars', resource_type: 'image' },
      async (error, result) => {
        if (error) {
          reject(error);
        } else {
          try {
            // Upload successful, now update the database
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: { avatarUrl: result.secure_url },
              select: {
                id: true,
                username: true,
                bio: true,
                avatarUrl: true,
                email: true,
              },
            });

            console.log('Avatar uploaded and saved to DB:', result.secure_url);

            resolve({
              url: result.secure_url,
              user: updatedUser,
            });
          } catch (dbError) {
            console.error('Database update error:', dbError);
            reject(dbError);
          }
        }
      }
    );
    stream.end(fileBuffer);
  });
};
