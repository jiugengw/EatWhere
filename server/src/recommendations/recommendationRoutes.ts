import { Router } from 'express';
import {
    discoverRecommendations,
    getFavourites,
    getGroupDiscoverRecommendations,
    getGroupRecommendations,
    getRecommendations,
    submitRating,
    toggleFavourite,
} from './recommendationController.js'
import { protect } from '../auth/authController.js';

const router = Router();

router.use(protect);

router.get('/', getRecommendations);
router.post('/ratings', submitRating);

router.route('/favourites')
    .post(toggleFavourite)
    .get(getFavourites);

router.get('/discover', discoverRecommendations);

router.get('/group/:groupId', getGroupRecommendations);
router.get('/group/:groupId/discover', getGroupDiscoverRecommendations);

export default router;