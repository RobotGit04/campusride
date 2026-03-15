import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';

import bikeRoutes from './routes/bike.routes.js';
app.use('/api/bikes', bikeRoutes);
import bookingRoutes from './routes/booking.routes.js';
app.use('/api/bookings', bookingRoutes);

import notificationRoutes from './routes/notification.routes.js';
import ratingRoutes from './routes/rating.routes.js';

app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);

import adminRoutes from './routes/admin.routes.js';

app.use('/api/admin', adminRoutes);

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'CampusRide API is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});