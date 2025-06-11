// src/services/chat/message.service.js
import prisma from '../../config/db.js';

export const fetchMessagesBetweenUsers = async (userId, contactId) => {
  try {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Database error occurred while fetching messages.');
  }
};

export const saveMessage = async (content, senderId, receiverId) => {
  try {
    return await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Database error occurred while creating a message.');
  }
};
