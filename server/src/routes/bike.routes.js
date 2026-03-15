import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';
import {
  createBike, getAllBikes, getBikeById,
  getOwnerBikes, updateBike, deleteBike
} from '../controllers/bike.controller.js';

const router = express.Router();

router.get('/', getAllBikes);
router.get('/:id', getBikeById);
router.post('/', protect, restrictTo('OWNER'), upload.array('photos', 5), createBike);
router.get('/owner/my-bikes', protect, restrictTo('OWNER'), getOwnerBikes);
router.put('/:id', protect, restrictTo('OWNER'), updateBike);
router.delete('/:id', protect, restrictTo('OWNER'), deleteBike);

export default router;