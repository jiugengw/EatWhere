import { Router } from 'express';
import {
    getGroupRecommendations,
    getRecommendations,
    predictRating,
    submitRating,
} from './recommendationController.js'
import { protect } from '../auth/authController.js';

const router = Router();

router.use(protect);

router.get('/', getRecommendations);                    
router.post('/ratings', submitRating);                 
router.get('/predict', predictRating);                  
router.get('/group/:groupId', getGroupRecommendations);

export default router;