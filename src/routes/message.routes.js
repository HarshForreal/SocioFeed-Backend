// src/routes/message.routes.js
import express from 'express';
import * as messageController from '../controllers/message.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get messages between two users
router.get(
  '/:userId/:contactId',
  authenticate,
  messageController.getMessagesBetweenUsers
);

// Create a new message
router.post('/', authenticate, messageController.createMessage);

export default router;
