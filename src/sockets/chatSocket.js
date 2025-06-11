import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('private_message', (data) => {
      const { receiverId, senderId, content } = data;

      socket.to(receiverId).emit('receive_message', {
        senderId,
        content,
        timestamp: new Date(),
      });

      console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
    });

    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('user_typing', {
        senderId: data.senderId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
