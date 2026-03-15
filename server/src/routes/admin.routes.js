import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getStats, getAllUsers, toggleSuspendUser,
  getAllListings, toggleSuspendListing,
  getAllBookings, updateCommissionRate
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleSuspendUser);
router.get('/listings', getAllListings);
router.put('/listings/:id/suspend', toggleSuspendListing);
router.get('/bookings', getAllBookings);
router.put('/commission', updateCommissionRate);

export default router;