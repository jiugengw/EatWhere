import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../common/utils/catchAsync.js';
import { AppError } from '../common/utils/AppError.js';
import {
    generateDiscoverRecommendations,
    generateRecommendations,
    getUserFavourites,
    processRating,
    toggleUserFavourite
} from './recommendationService.js'
import { RecommendationRequest, CUISINES, CuisineType } from './types.js';

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