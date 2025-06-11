import express from 'express';
import * as messageController from '../controllers/message.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get(
  '/:userId/:contactId',
  authenticate,
  messageController.getMessagesBetweenUsers
);

router.post('/', authenticate, messageController.createMessage);

export default router;
