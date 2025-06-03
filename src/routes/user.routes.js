import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; // your JWT auth middleware
import multer from 'multer';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/profile/:username', authenticate, userController.getUserProfile);
router.put('/profile/edit', authenticate, userController.editUserProfile);
router.post('/follow/:userId', authenticate, userController.followUser);
router.post('/unfollow/:userId', authenticate, userController.unfollowUser);
router.get('/followers/:userId', authenticate, userController.getFollowers);
router.get('/following/:userId', authenticate, userController.getFollowing);
router.get('/followers', authenticate, userController.getFollowers);
router.get('/following', authenticate, userController.getFollowing);
router.get('/search', authenticate, userController.searchUsers);
router.get('/posts/:userId', authenticate, userController.getUserPosts);
router.get('/posts', authenticate, userController.getUserPosts);
router.post(
  '/avatar-upload',
  authenticate,
  upload.single('avatar'),
  userController.uploadAvatar
);
export default router;
