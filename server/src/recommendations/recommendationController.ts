import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../common/utils/catchAsync.js';
import { AppError } from '../common/utils/AppError.js';
import {
    generateDiscoverRecommendations,
    generateGroupDiscoverRecommendations,
    generateGroupRecommendations,
    generateRecommendations,
    getUserFavourites,
    processRating,
    toggleUserFavourite
} from './recommendationService.js'
import { RecommendationRequest, CUISINES, CuisineType, type GroupRecommendationRequest } from './types.js';
import { generateRestaurantRecommendations } from './restaurantRecommendationService.js';

export const getRecommendations = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }

    const { limit } = req.query;

    const request: RecommendationRequest = {
        userId: req.user.id,  // ← Use authenticated user
        limit: limit ? parseInt(limit as string, 10) : 5
    };

    const recommendations = await generateRecommendations(request);

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: recommendations
    });
});

export const submitRating = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }

    const { cuisineName, rating } = req.body; 

    if (!cuisineName || rating === undefined) {
        return next(new AppError('Cuisine name and rating are required', StatusCodes.BAD_REQUEST));
    }

    if (rating < 1 || rating > 5) {
        return next(new AppError('Rating must be between 1 and 5', StatusCodes.BAD_REQUEST));
    }

    if (!CUISINES.includes(cuisineName as CuisineType)) {
        return next(new AppError(`Invalid cuisine. Must be one of: ${CUISINES.join(', ')}`, StatusCodes.BAD_REQUEST));
    }

    await processRating(req.user.id, cuisineName, rating);  

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Rating submitted successfully'
    });
});

export const toggleFavourite = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { cuisineName } = req.body;

  if (!cuisineName) {
    return next(new AppError('Cuisine name is required', StatusCodes.BAD_REQUEST));
  }

  if (!CUISINES.includes(cuisineName as CuisineType)) {
    return next(new AppError(`Invalid cuisine. Must be one of: ${CUISINES.join(', ')}`, StatusCodes.BAD_REQUEST));
  }

  const result = await toggleUserFavourite(req.user.id, cuisineName);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: result.isFavourited ? 'Added to favourites' : 'Removed from favourites',
    data: {
      cuisineName,
      isFavourited: result.isFavourited
    }
  });
});

export const getFavourites = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const favourites = await getUserFavourites(req.user.id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      favourites
    }
  });
});

export const discoverRecommendations = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { limit } = req.query;

  const request: RecommendationRequest = {
    userId: req.user.id,
    limit: limit ? parseInt(limit as string, 10) : 4
  };

  const recommendations = await generateDiscoverRecommendations(request);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: recommendations
  });
});

export const getGroupRecommendations = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { groupId } = req.params;
  const { limit } = req.query;

  const request: GroupRecommendationRequest = {
    groupId,
    limit: limit ? parseInt(limit as string, 10) : 5
  };

  const recommendations = await generateGroupRecommendations(request);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: recommendations
  });
});

export const getGroupDiscoverRecommendations = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { groupId } = req.params;
  const { limit } = req.query;

  const request: GroupRecommendationRequest = {
    groupId,
    limit: limit ? parseInt(limit as string, 10) : 4
  };

  const recommendations = await generateGroupDiscoverRecommendations(request);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: recommendations
  });
});


export const getRestaurantRecommendations = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }

    const { lat, lng, limit } = req.query;

    // Validate required parameters
    if (!lat || !lng) {
        return next(new AppError('Latitude and longitude are required', StatusCodes.BAD_REQUEST));
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
        return next(new AppError('Invalid latitude or longitude values', StatusCodes.BAD_REQUEST));
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
        return next(new AppError('Latitude must be between -90 and 90', StatusCodes.BAD_REQUEST));
    }

    if (longitude < -180 || longitude > 180) {
        return next(new AppError('Longitude must be between -180 and 180', StatusCodes.BAD_REQUEST));
    }

    // Validate and parse limit
    let restaurantLimit = 5; // Default
    if (limit) {
        const parsedLimit = parseInt(limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 10) {
            return next(new AppError('Limit must be between 1 and 10', StatusCodes.BAD_REQUEST));
        }
        restaurantLimit = parsedLimit;
    }

    try {
        const recommendations = await generateRestaurantRecommendations({
            userId: req.user.id,
            lat: latitude,
            lng: longitude,
            limit: restaurantLimit
        });

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: recommendations
        });
    } catch (error) {
        if (error instanceof Error) {
            return next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
        }
        return next(new AppError('Failed to generate restaurant recommendations', StatusCodes.INTERNAL_SERVER_ERROR));
    }
});