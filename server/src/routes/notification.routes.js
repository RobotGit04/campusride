import express from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, markAllRead, getUnreadCount } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-read', protect, markAllRead);

export default router;