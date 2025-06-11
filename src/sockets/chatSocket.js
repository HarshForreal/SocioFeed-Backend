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

    // Join user to their own room (for private messaging)
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle private messages
    socket.on('private_message', (data) => {
      const { receiverId, senderId, content } = data;

      // Send message to the receiver's room
      socket.to(receiverId).emit('receive_message', {
        senderId,
        content,
        timestamp: new Date(),
      });

      console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('user_typing', {
        senderId: data.senderId,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export io instance for use in other parts of the application
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
