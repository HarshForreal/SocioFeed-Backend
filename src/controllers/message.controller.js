// src/controllers/message.controller.js
import * as messageService from '../services/chat/message.service.js';

export const getMessagesBetweenUsers = async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    const messages = await messageService.fetchMessagesBetweenUsers(
      userId,
      contactId
    );
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching messages' });
  }
};

export const createMessage = async (req, res) => {
  const { content, senderId, receiverId } = req.body;

  if (!content || !senderId || !receiverId) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const newMessage = await messageService.saveMessage(
      content,
      senderId,
      receiverId
    );
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error creating message' });
  }
};
