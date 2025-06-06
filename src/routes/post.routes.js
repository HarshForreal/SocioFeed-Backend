import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
const router = express.Router();

router.post('/create', authenticate, postController.handleCreatePost);
router.get('/feed', authenticate, postController.handleGetFeed);
router.post(
  '/upload',
  authenticate,
  upload.array('images', 4),
  postController.handleImageUpload
);
router.patch('/like/:id', authenticate, postController.handleToggleLike);
router.post('/save/:id', authenticate, postController.handleSavePost);
router.delete('/unsave/:id', authenticate, postController.handleUnsavePost);
router.get('/saved', authenticate, postController.handleGetSavedPosts);
router.get('/:id', authenticate, postController.handleGetPostById);
router.delete('/delete/:id', authenticate, postController.handleDeletePost);
router.post('/:postId/comment', authenticate, postController.handleAddComment);
router.get('/:postId/comments', authenticate, postController.handleGetComments);
router.put(
  '/comment/edit/:commentId',
  authenticate,
  postController.handleEditComment
);
router.delete(
  '/comment/delete/:commentId',
  authenticate,
  postController.handleDeleteComment
);

export default router;
