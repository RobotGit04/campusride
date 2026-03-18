import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes.js';
import bikeRoutes from './routes/bike.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later' }
});
app.use('/api/auth/', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CampusRide API is running' });
});

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