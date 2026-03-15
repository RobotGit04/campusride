import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createBooking, updateBookingStatus, getRenterBookings,
  getOwnerBookings, getBookingById, cancelBooking
} from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', protect, restrictTo('RENTER'), createBooking);
router.get('/renter', protect, restrictTo('RENTER'), getRenterBookings);
router.get('/owner', protect, restrictTo('OWNER'), getOwnerBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, restrictTo('OWNER'), updateBookingStatus);
router.put('/:id/cancel', protect, restrictTo('RENTER'), cancelBooking);

export default router;