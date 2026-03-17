import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';
import {
  createBike, getAllBikes, getBikeById,
  getOwnerBikes, updateBike, deleteBike
} from '../controllers/bike.controller.js';

const router = express.Router();

router.get('/', getAllBikes);
router.get('/owner/my-bikes', protect, restrictTo('OWNER'), getOwnerBikes);
router.get('/:id', getBikeById);

router.post('/', protect, restrictTo('OWNER'), (req, res, next) => {
  upload.array('photos', 5)(req, res, (err) => {
    if (err) {
      console.error('UPLOAD ERROR:', err);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
    next();
  });
}, createBike);

router.put('/:id', protect, restrictTo('OWNER'), updateBike);
router.delete('/:id', protect, restrictTo('OWNER'), deleteBike);

export default router;