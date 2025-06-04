import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, HEIC images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { files: 4, fileSize: 5 * 1024 * 1024 },
});

export default upload;
