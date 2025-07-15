import { User } from '../users/userModel.js';
import { CUISINES, CuisineType } from './types.js';

interface RestaurantData {
  id: string;
  name: string;
  cuisine: CuisineType;
  googleRating?: number;
  priceLevel?: number;
}

// 1. GET USER'S CUISINE SCORE (manual preference × weight)
const getCuisineScore = async (userId: string, cuisine: CuisineType): Promise<number> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Get manual preference (1-5 scale) - NEVER changes automatically
  const manualPreference = user.preferences.get(cuisine) || 2.5;
  
  // Get learned weight based on past rating accuracy (default 1.0)
  const weight = user.cuisineWeights?.get(cuisine) || 1.0;
  
  // Return true preference = manual preference × learned weight
  return manualPreference * weight;
};

// 2. PREDICT RESTAURANT RATING
export const predictRestaurantRating = async (userId: string, restaurant: RestaurantData): Promise<number> => {
  // Get weighted cuisine score (manual preference × weight)
  const cuisineScore = await getCuisineScore(userId, restaurant.cuisine);
  
  // Get restaurant quality score
  const restaurantScore = restaurant.googleRating || 3.0;
  
  // Combine: 70% cuisine score + 30% restaurant rating
  const finalScore = (cuisineScore * 0.7) + (restaurantScore * 0.3);
  
  // Keep within 1-5 range
  return Math.max(1, Math.min(5, finalScore));
};

// 3. PREDICT MULTIPLE RESTAURANTS (for discover page)
export const predictMultipleRestaurants = async (
  userId: string, 
  restaurants: RestaurantData[]
): Promise<{ restaurantId: string; predictedRating: number; restaurant: RestaurantData }[]> => {
  const predictions = [];
  
  for (const restaurant of restaurants) {
    const predictedRating = await predictRestaurantRating(userId, restaurant);
    
    predictions.push({
      restaurantId: restaurant.id,
      predictedRating: Number(predictedRating.toFixed(1)),
      restaurant
    });
  }
  
  // Sort by predicted rating (highest first)
  return predictions.sort((a, b) => b.predictedRating - a.predictedRating);
};

// 4. UPDATE WEIGHTS AFTER RATING
export const updateWeightsAfterRating = async (
  userId: string, 
  restaurant: RestaurantData, 
  actualRating: number
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Get what we predicted
  const prediction = await predictRestaurantRating(userId, restaurant);
  
  // Calculate error (positive = they liked it more, negative = they liked it less)
  const error = actualRating - prediction;
  
  // Get current weight for this cuisine (default 1.0)
  const currentWeight = user.cuisineWeights?.get(restaurant.cuisine) || 1.0;
  
  // Adjust weight based on error direction and magnitude
  let newWeight = currentWeight;
  
  if (error > 1.0) {
    // They liked it way more than predicted - boost weight
    // Their true preference is higher than manual preference
    newWeight += 0.1;
  } else if (error > 0.5) {
    // They liked it more than predicted - small boost
    newWeight += 0.05;
  } else if (error < -1.0) {
    // They liked it way less than predicted - reduce weight
    // Their true preference is lower than manual preference  
    newWeight -= 0.1;
  } else if (error < -0.5) {
    // They liked it less than predicted - small reduction
    newWeight -= 0.05;
  }
  
  // Keep weight within reasonable bounds
  newWeight = Math.max(0.5, Math.min(1.5, newWeight));
  
  // Save updated weight (initialize cuisineWeights if needed)
  if (!user.cuisineWeights) {
    user.cuisineWeights = new Map();
  }
  user.cuisineWeights.set(restaurant.cuisine, newWeight);
  await user.save();
  
  console.log(`Updated ${restaurant.cuisine} weight for user ${userId}: ${currentWeight.toFixed(2)} → ${newWeight.toFixed(2)} (error: ${error.toFixed(2)})`);
};

// USAGE:
// For restaurant recommendations: predictMultipleRestaurants(userId, restaurants)
// For single restaurant rating: predictRestaurantRating(userId, restaurant)
// After user rates: updateWeightsAfterRating(userId, restaurant, rating)