import { User } from '../users/userModel.js';
import { UserRecommendationData } from './recommendationModel.js';
import { searchNearbyPlaces } from '../api/apiService.js';
import { CUISINES, CuisineType } from './types.js';

interface RestaurantRecommendation {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  price_level?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
  cuisine: string;
  cuisineScore: number;
  combinedScore: number;
  reasoning: string;
  distance?: number;
}

interface RestaurantRecommendationRequest {
  userId: string;
  lat: number;
  lng: number;
  limit: number;
}

interface RestaurantRecommendationResponse {
  restaurants: RestaurantRecommendation[];
  userAdaptationLevel: string;
  totalRatings: number;
  filterCriteria: {
    minCuisineScore: number;
    eligibleCuisines: string[];
  };
  generatedAt: Date;
}

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
  // Fallback mappings for common types
  'restaurant': 'Western', // Default fallback
  'food': 'Western',
  'establishment': 'Western'
};

// Keywords to help identify cuisine types from restaurant names/types
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

const createDefaultHiddenData = async (userId: string) => {
  const defaultAdjustments: { [K in CuisineType]: number } = {} as any;
  for (const cuisine of CUISINES) {
    defaultAdjustments[cuisine] = 0;
  }

  const hiddenData = new UserRecommendationData({
    userId,
    hiddenAdjustments: defaultAdjustments,
    totalRatings: 0,
    adaptationRate: 0.3
  });

  await hiddenData.save();
  return hiddenData;
};

const getUserAdaptationLevel = (totalRatings: number): string => {
  if (totalRatings < 5) return 'new';
  if (totalRatings < 25) return 'learning';
  return 'established';
};

const identifyRestaurantCuisine = (restaurant: any): CuisineType => {
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

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

const getDistanceFactor = (distance: number): number => {
  // Distance factor: 1.0 for very close, 0.5 for far
  if (distance <= 1) return 1.0;      // Within 1km
  if (distance <= 3) return 0.9;      // Within 3km
  if (distance <= 5) return 0.8;      // Within 5km
  if (distance <= 10) return 0.7;     // Within 10km
  return 0.5;                         // Beyond 10km
};

const generateRestaurantReasoning = (
  cuisine: string, 
  cuisineScore: number, 
  googleRating: number, 
  distance: number
): string => {
  const roundedCuisineScore = Math.round(cuisineScore * 10) / 10;
  const distanceText = distance < 1 ? 'very close to you' : 
                      distance < 3 ? 'nearby' : 
                      distance < 5 ? 'within easy reach' : 'in your area';

  if (cuisineScore >= 4.5) {
    return `Excellent ${cuisine} match (${roundedCuisineScore}★) and ${distanceText}`;
  } else if (cuisineScore >= 4.0) {
    return `Strong ${cuisine} recommendation (${roundedCuisineScore}★) and ${distanceText}`;
  } else if (cuisineScore >= 3.5) {
    return `Good ${cuisine} option (${roundedCuisineScore}★) and ${distanceText}`;
  } else {
    return `Popular restaurant ${distanceText} with decent ratings`;
  }
};

export const generateRestaurantRecommendations = async (
  request: RestaurantRecommendationRequest
): Promise<RestaurantRecommendationResponse> => {
  const { userId, lat, lng, limit } = request;

  // Get user data
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let hiddenData = await UserRecommendationData.findOne({ userId });
  if (!hiddenData) {
    hiddenData = await createDefaultHiddenData(userId);
  }

  // Calculate cuisine scores (same logic as your existing recommendation system)
  const cuisineScores = new Map<string, number>();
  const favourites = hiddenData.favourites || [];

  for (const cuisine of CUISINES) {
    const manualScore = user.preferences.get(cuisine) || 0;
    const hiddenAdjustment = hiddenData.hiddenAdjustments[cuisine] || 0;
    const favouriteBonus = favourites.includes(cuisine) ? 0.5 : 0;
    const baseScore = Math.max(1, Math.min(5, (manualScore + hiddenAdjustment + favouriteBonus) + 3));
    
    cuisineScores.set(cuisine, baseScore);
  }

  // Filter for cuisines with score >= 3.5
  const MIN_CUISINE_SCORE = 3.5;
  const eligibleCuisines = Array.from(cuisineScores.entries())
    .filter(([_, score]) => score >= MIN_CUISINE_SCORE)
    .map(([cuisine]) => cuisine);

  if (eligibleCuisines.length === 0) {
    // If no cuisines meet the threshold, use top 3 cuisines
    const topCuisines = Array.from(cuisineScores.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cuisine]) => cuisine);
    eligibleCuisines.push(...topCuisines);
  }

  // Fetch nearby restaurants
  const placesData = await searchNearbyPlaces({
    lat,
    lng,
    radius: 5000, // 5km radius
    type: 'restaurant'
  });

  // Process and filter restaurants
  const restaurantRecommendations: RestaurantRecommendation[] = [];

  for (const restaurant of placesData.results) {
    // Identify cuisine type
    const cuisine = identifyRestaurantCuisine(restaurant);
    const cuisineScore = cuisineScores.get(cuisine) || 2.5;

    // Filter by eligible cuisines
    if (!eligibleCuisines.includes(cuisine)) {
      continue;
    }

    // Calculate distance
    const distance = calculateDistance(
      lat, lng,
      restaurant.geometry.location.lat,
      restaurant.geometry.location.lng
    );

    // Calculate combined score
    const googleRating = restaurant.rating || 3.0;
    const distanceFactor = getDistanceFactor(distance);
    const combinedScore = googleRating * cuisineScore * distanceFactor;

    // Generate reasoning
    const reasoning = generateRestaurantReasoning(cuisine, cuisineScore, googleRating, distance);

    restaurantRecommendations.push({
      place_id: restaurant.place_id,
      name: restaurant.name,
      vicinity: restaurant.vicinity || '',
      rating: restaurant.rating,
      price_level: restaurant.price_level,
      geometry: restaurant.geometry,
      photos: restaurant.photos,
      types: restaurant.types,
      cuisine,
      cuisineScore,
      combinedScore,
      reasoning,
      distance
    });
  }

  // Sort by combined score and take top N
  const topRestaurants = restaurantRecommendations
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, limit);

  return {
    restaurants: topRestaurants,
    userAdaptationLevel: getUserAdaptationLevel(hiddenData.totalRatings),
    totalRatings: hiddenData.totalRatings,
    filterCriteria: {
      minCuisineScore: MIN_CUISINE_SCORE,
      eligibleCuisines
    },
    generatedAt: new Date()
  };
};