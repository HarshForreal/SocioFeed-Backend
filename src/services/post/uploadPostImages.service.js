import cloudinary from '../../config/cloudinary.js';

export const uploadPostImagesService = async (fileBuffers) => {
  const streamUpload = (buffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'post-images',
          resource_type: 'image',
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto',
              width: 800,
              height: 600,
              crop: 'limit',
            },
          ],
        },
        (error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        }
      );
      stream.end(buffer);
    });

  return Promise.all(fileBuffers.map((buffer) => streamUpload(buffer)));
};
