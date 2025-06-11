import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'File too large. Max 10MB allowed.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res
        .status(400)
        .json({ message: 'Too many files. Max 4 images allowed.' });
    }
  }

  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};
