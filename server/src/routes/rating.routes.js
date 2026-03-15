import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { createRating, getBikeRatings } from '../controllers/rating.controller.js';

const router = express.Router();

router.post('/', protect, restrictTo('RENTER'), createRating);
router.get('/bike/:bikeId', getBikeRatings);

export default router;