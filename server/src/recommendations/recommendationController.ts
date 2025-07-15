// server/src/recommendations/recommendationController.ts

import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../common/utils/catchAsync.js';
import { AppError } from '../common/utils/AppError.js';
import { 
  predictMultipleRestaurants,
  predictRestaurantRating,
  updateWeightsAfterRating
} from './recommendationService.js';
import { CUISINES, CuisineType } from './types.js';

// 1. GET RESTAURANT RECOMMENDATIONS (for /discover page)
export const getRecommendations = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { lat, lng, limit = 10 } = req.query;

  // Validate location parameters
  if (!lat || !lng) {
    return next(new AppError('Latitude and longitude are required', StatusCodes.BAD_REQUEST));
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    return next(new AppError('Invalid latitude or longitude values', StatusCodes.BAD_REQUEST));
  }

  try {
    // Import searchNearbyPlaces function
    const { searchNearbyPlaces } = await import('../api/apiService.js');
    
    // Get nearby restaurants from Google Places
    const placesData = await searchNearbyPlaces({
      lat: latitude,
      lng: longitude,
      radius: 2000, // 2km radius
      type: 'restaurant'
    });

    if (placesData.results.length === 0) {
      return res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
          recommendations: [],
          message: 'No restaurants found in your area',
          generatedAt: new Date()
        }
      });
    }

    // Convert Google Places results to our restaurant format and predict ratings
    const restaurantsWithCuisine = placesData.results.map(place => ({
      id: place.place_id,
      name: place.name,
      cuisine: identifyRestaurantCuisine(place),
      googleRating: place.rating,
      priceLevel: place.price_level,
      // Keep original place data for frontend
      place_id: place.place_id,
      vicinity: place.vicinity,
      geometry: place.geometry,
      photos: place.photos,
      types: place.types
    }));

    // Get predictions for all restaurants
    const predictions = await predictMultipleRestaurants(req.user.id, restaurantsWithCuisine);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        recommendations: predictions.slice(0, parseInt(limit as string)),
        userAdaptationLevel: 'learning',
        totalRatings: 0,
        generatedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return next(new AppError('Failed to fetch restaurant recommendations', StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

// 2. PREDICT RATING FOR A RESTAURANT (optional endpoint)
export const predictRating = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { restaurantId, restaurantName, cuisine, googleRating, priceLevel } = req.query;

  if (!restaurantId || !cuisine) {
    return next(new AppError('Restaurant ID and cuisine are required', StatusCodes.BAD_REQUEST));
  }

  if (!CUISINES.includes(cuisine as CuisineType)) {
    return next(new AppError(`Invalid cuisine. Must be one of: ${CUISINES.join(', ')}`, StatusCodes.BAD_REQUEST));
  }

  const restaurant = {
    id: restaurantId as string,
    name: (restaurantName as string) || 'Unknown Restaurant',
    cuisine: cuisine as CuisineType,
    googleRating: googleRating ? parseFloat(googleRating as string) : undefined,
    priceLevel: priceLevel ? parseInt(priceLevel as string) : undefined
  };

  const prediction = await predictRestaurantRating(req.user.id, restaurant);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      restaurantId,
      predictedRating: Number(prediction.toFixed(1)),
      formula: 'Cuisine Score (1-5 × weight) × 0.7 + Restaurant Rating × 0.3'
    }
  });
});

// 3. SUBMIT RESTAURANT RATING & UPDATE WEIGHTS
export const submitRating = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { restaurantId, restaurantName, cuisine, rating, googleRating, priceLevel } = req.body;

  // Validate inputs
  if (!restaurantId || !cuisine || rating === undefined) {
    return next(new AppError('Restaurant ID, cuisine, and rating are required', StatusCodes.BAD_REQUEST));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', StatusCodes.BAD_REQUEST));
  }

  if (!CUISINES.includes(cuisine as CuisineType)) {
    return next(new AppError(`Invalid cuisine. Must be one of: ${CUISINES.join(', ')}`, StatusCodes.BAD_REQUEST));
  }

  // Create restaurant object
  const restaurant = {
    id: restaurantId,
    name: restaurantName || 'Unknown Restaurant',
    cuisine: cuisine as CuisineType,
    googleRating: googleRating || undefined,
    priceLevel: priceLevel || undefined
  };

  // Update weights based on this rating
  await updateWeightsAfterRating(req.user.id, restaurant, rating);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Rating submitted and weights updated',
    data: {
      restaurantId,
      rating,
      cuisine
    }
  });
});

// 4. GET GROUP RECOMMENDATIONS (with Google API)
export const getGroupRecommendations = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { groupId } = req.params;
  const { lat, lng, limit = 10 } = req.query;

  // Validate location parameters
  if (!lat || !lng) {
    return next(new AppError('Latitude and longitude are required', StatusCodes.BAD_REQUEST));
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    return next(new AppError('Invalid latitude or longitude values', StatusCodes.BAD_REQUEST));
  }

  try {
    // Import searchNearbyPlaces function
    const { searchNearbyPlaces } = await import('../api/apiService.js');
    
    // Get nearby restaurants from Google Places
    const placesData = await searchNearbyPlaces({
      lat: latitude,
      lng: longitude,
      radius: 2000, // 2km radius
      type: 'restaurant'
    });

    if (placesData.results.length === 0) {
      return res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
          recommendations: [],
          message: 'No restaurants found for group',
          generatedAt: new Date()
        }
      });
    }

    // Convert Google Places results to our restaurant format
    const restaurantsWithCuisine = placesData.results.map(place => ({
      id: place.place_id,
      name: place.name,
      cuisine: identifyRestaurantCuisine(place),
      googleRating: place.rating,
      priceLevel: place.price_level,
      // Keep original place data for frontend
      place_id: place.place_id,
      vicinity: place.vicinity,
      geometry: place.geometry,
      photos: place.photos,
      types: place.types
    }));

    // TODO: Implement group prediction logic
    // For now, use personal predictions
    const predictions = await predictMultipleRestaurants(req.user.id, restaurantsWithCuisine);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        recommendations: predictions.slice(0, parseInt(limit as string)),
        userAdaptationLevel: 'group',
        totalRatings: 0,
        generatedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Error fetching group recommendations:', error);
    return next(new AppError('Failed to fetch group restaurant recommendations', StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

// Add cuisine identification function (reuse from existing code)
const identifyRestaurantCuisine = (restaurant: any): CuisineType => {
  // Map Google Places types to our cuisine types
  const GOOGLE_TYPE_TO_CUISINE: { [key: string]: CuisineType } = {
    'chinese_restaurant': 'Chinese',
    'japanese_restaurant': 'Japanese', 
    'korean_restaurant': 'Korean',
    'italian_restaurant': 'Italian',
    'mexican_restaurant': 'Mexican',
    'indian_restaurant': 'Indian',
    'thai_restaurant': 'Thai',
    'french_restaurant': 'French',
    'vietnamese_restaurant': 'Vietnamese',
    'american_restaurant': 'Western',
    'fast_food': 'Fast Food',
    'restaurant': 'Western', // Default fallback
    'food': 'Western',
    'establishment': 'Western'
  };

  // Keywords to help identify cuisine types from restaurant names
  const CUISINE_KEYWORDS: { [key: string]: CuisineType } = {
    'sushi': 'Japanese',
    'ramen': 'Japanese',
    'pizza': 'Italian',
    'pasta': 'Italian', 
    'burger': 'Fast Food',
    'mcdonald': 'Fast Food',
    'kfc': 'Fast Food',
    'subway': 'Fast Food',
    'chinese': 'Chinese',
    'dim sum': 'Chinese',
    'thai': 'Thai',
    'indian': 'Indian',
    'curry': 'Indian',
    'korean': 'Korean',
    'bbq': 'Korean',
    'mexican': 'Mexican',
    'taco': 'Mexican',
    'french': 'French',
    'vietnamese': 'Vietnamese',
    'pho': 'Vietnamese',
    'halal': 'Muslim',
    'muslim': 'Muslim'
  };

  // First, check Google Places types
  for (const type of restaurant.types || []) {
    if (GOOGLE_TYPE_TO_CUISINE[type]) {
      return GOOGLE_TYPE_TO_CUISINE[type];
    }
  }

  // Then, check restaurant name for cuisine keywords
  const name = restaurant.name?.toLowerCase() || '';
  const vicinity = restaurant.vicinity?.toLowerCase() || '';
  const searchText = `${name} ${vicinity}`;

  for (const [keyword, cuisine] of Object.entries(CUISINE_KEYWORDS)) {
    if (searchText.includes(keyword)) {
      return cuisine;
    }
  }

  // Default fallback
  return 'Western';
};