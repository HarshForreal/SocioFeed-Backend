import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import cookieParser from 'cookie-parser';
import { initSocket } from './sockets/chatSocket.js';
import { errorHandler } from './middlewares/error.middleware.js';
import cors from 'cors';

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messages', messageRoutes);

app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket (Socket.IO)
initSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is ready on http://localhost:${PORT}`);
});

export default app; // Export app for testing or other purposes
