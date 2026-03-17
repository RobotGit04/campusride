import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'djomx3cdn',
  api_key: '781455993964238',
  api_secret: 'wLzAGpo2Bl7X-teis1g64vVndvA',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusride/bikes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

export const upload = multer({ storage });
export default cloudinary;