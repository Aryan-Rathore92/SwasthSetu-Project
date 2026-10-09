import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/socketHandler.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  },
});

initSocket(io);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  SWASTHSETU HEALTHCARE PLATFORM BACKEND STARTED   `);
      console.log(`  Server Port: http://localhost:${PORT}             `);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Demo Mode:   ${process.env.DEMO_MODE === 'true' ? 'ACTIVE (OTP: 123456)' : 'OFF'}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  }
};

startServer();

