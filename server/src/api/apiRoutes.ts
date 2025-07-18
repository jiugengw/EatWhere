import express from 'express';
import { searchPlaces, getPlacePhoto } from './apiController.js';
import { protect } from '../auth/authController.js';

const router = express.Router();

router.use(protect);

router.get('/places', searchPlaces);
router.get('/photo/:photoReference', getPlacePhoto);

export default router;