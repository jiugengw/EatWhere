import { UserPreferences, IUserPreferences } from './userPreferencesModel.js';
import { 
  RecommendationRequest, 
  RecommendationResponse, 
  RecommendationResult,
  CuisineRating,
  CUISINES,
  CuisineType 
} from './types.js';

export const generateRecommendations = async (
  request: RecommendationRequest
): Promise<RecommendationResponse> => {
  try {
    const userPrefs = await UserPreferences.findOne({ userId: request.userId });
    if (!userPrefs) {
      throw new Error('User preferences not found');
    }

    const finalScores = calculateFinalCuisineScores(userPrefs);
    
    const recommendations = finalScores
      .sort((a, b) => b.score - a.score)
      .slice(0, request.limit || 5);

    return {
      recommendations,
      userAdaptationLevel: getUserAdaptationLevel(userPrefs.totalRatings),
      totalRatings: userPrefs.totalRatings,
      generatedAt: new Date()
    };
  } catch (error: any) {
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
};

const calculateFinalCuisineScores = (userPrefs: IUserPreferences): RecommendationResult[] => {
  const results: RecommendationResult[] = [];
  
  for (const cuisine of CUISINES) {
    // CORE: Combine manual preference + hidden adjustment
    const manualScore = userPrefs.manualPreferences[cuisine];
    const hiddenAdjustment = userPrefs.hiddenAdjustments[cuisine];
    // Convert from -2,2 scale to 1,5 scale for calculations: add 3 to shift scale
    const baseScore = Math.max(1, Math.min(5, (manualScore + hiddenAdjustment) + 3));
    
    // Apply additional algorithm factors
    const confidenceWeight = calculateConfidenceWeight(userPrefs.totalRatings);
    const explorationFactor = calculateExplorationFactor(userPrefs, cuisine, baseScore);
    const diversityBonus = calculateDiversityBonus(userPrefs, baseScore);
    
    const finalScore = (
      baseScore * confidenceWeight +
      explorationFactor +
      diversityBonus
    );

    const confidenceLevel = calculateConfidenceLevel(userPrefs.totalRatings, baseScore);
    const reasoning = generateReasoning(
      manualScore, 
      hiddenAdjustment, 
      explorationFactor, 
      userPrefs.totalRatings
    );

    results.push({
      cuisineName: cuisine,
      score: Math.round(finalScore * 100) / 100,
      confidenceLevel,
      reasoning
    });
  }

  return results;
};

const calculateConfidenceWeight = (totalRatings: number): number => {
  return Math.min(0.9, 0.6 + (totalRatings * 0.01));
};

const calculateExplorationFactor = (
  userPrefs: IUserPreferences, 
  cuisine: string, 
  baseScore: number
): number => {
  const totalRatings = userPrefs.totalRatings;
  
  const explorationBonus = totalRatings < 20 ? 0.8 : 0.3;
  const neutralityBonus = Math.abs(baseScore - 2.5) < 0.5 ? 0.4 : 0;
  
  return explorationBonus + neutralityBonus;
};

const calculateDiversityBonus = (userPrefs: IUserPreferences, baseScore: number): number => {
  const manualScores = Object.values(userPrefs.manualPreferences);
  const avgScore = manualScores.reduce((sum, score) => sum + score, 0) / manualScores.length;
  // Convert avgScore to 1-5 scale for comparison
  const avgScoreConverted = avgScore + 3;
  
  return Math.abs(baseScore - avgScoreConverted) * 0.1;
};

const calculateConfidenceLevel = (totalRatings: number, baseScore: number): number => {
  const ratingConfidence = Math.min(1, totalRatings / 50);
  const scoreConfidence = Math.abs(baseScore - 2.5) / 2.5;
  
  return Math.round((ratingConfidence + scoreConfidence) * 50) / 100;
};

const generateReasoning = (
  manualScore: number,
  hiddenAdjustment: number,
  explorationFactor: number,
  totalRatings: number
): string => {
  const finalScore = (manualScore + hiddenAdjustment) + 3; // Convert to 1-5 scale
  
  // If hidden algorithm has learned something significant
  if (Math.abs(hiddenAdjustment) > 0.3) {
    if (hiddenAdjustment > 0) {
      return "You enjoy this more than expected based on your ratings";
    } else {
      return "You might enjoy this less than your preference suggests";
    }
  }
  
  if (finalScore >= 4) {
    return "Strong match for your taste profile";
  } else if (finalScore <= 2) {
    return "May not align with your preferences";
  } else if (explorationFactor > 0.5) {
    return totalRatings < 10 ? "New cuisine to explore" : "Worth trying again";
  } else {
    return "Moderate match for your preferences";
  }
};

const getUserAdaptationLevel = (totalRatings: number): string => {
  if (totalRatings < 5) return 'new';
  if (totalRatings < 25) return 'learning';
  return 'established';
};

// CORE FUNCTION: This updates the hidden layer when user rates food
export const processRating = async (
  userId: string,
  cuisineName: CuisineType,
  rating: number
): Promise<IUserPreferences> => {
  try {
    const userPrefs = await UserPreferences.findOne({ userId });
    if (!userPrefs) {
      throw new Error('User preferences not found');
    }

    // Calculate what the system expected vs what user actually rated
    const manualScore = userPrefs.manualPreferences[cuisineName];
    const currentHiddenAdjustment = userPrefs.hiddenAdjustments[cuisineName];
    // Convert to 1-5 scale for comparison with rating
    const expectedScore = (manualScore + currentHiddenAdjustment) + 3;
    
    // How far off was our prediction?
    const predictionError = rating - expectedScore;
    
    // Update hidden adjustment based on prediction error
    const adaptationRate = calculateAdaptationRate(userPrefs.totalRatings);
    const newHiddenAdjustment = currentHiddenAdjustment + (predictionError * adaptationRate);
    
    // Clamp hidden adjustment to reasonable bounds (-2 to +2)
    const clampedAdjustment = Math.max(-2, Math.min(2, newHiddenAdjustment));

    // Update the database
    const updatedPrefs = await UserPreferences.findOneAndUpdate(
      { userId },
      {
        $set: {
          [`hiddenAdjustments.${cuisineName}`]: clampedAdjustment,
          totalRatings: userPrefs.totalRatings + 1,
          adaptationRate: calculateAdaptationRate(userPrefs.totalRatings + 1)
        }
      },
      { new: true }
    );

    return updatedPrefs!;
  } catch (error: any) {
    throw new Error(`Failed to process rating: ${error.message}`);
  }
};

const calculateAdaptationRate = (totalRatings: number): number => {
  if (totalRatings < 10) return 0.2;   // Fast learning for new users
  if (totalRatings < 50) return 0.1;   // Moderate for learning users  
  return 0.05;                         // Slow for experienced users
};

// User can update their manual preferences anytime (Layer 1)
export const updateManualPreferences = async (
  userId: string,
  newManualPreferences: Partial<{ [K in CuisineType]: number }>
): Promise<IUserPreferences> => {
  try {
    const updateObject: any = {};
    
    for (const [cuisine, score] of Object.entries(newManualPreferences)) {
      if (CUISINES.includes(cuisine as CuisineType) && score >= -2 && score <= 2) {
        updateObject[`manualPreferences.${cuisine}`] = score;
      }
    }

    const updatedPrefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: updateObject },
      { new: true }
    );

    if (!updatedPrefs) {
      throw new Error('User preferences not found');
    }

    return updatedPrefs;
  } catch (error: any) {
    throw new Error(`Failed to update preferences: ${error.message}`);
  }
};

export const initializeUserPreferences = async (
  userId: string,
  initialManualPreferences: Partial<{ [K in CuisineType]: number }> = {}
): Promise<IUserPreferences> => {
  try {
    // Check if user already exists
    const existingPrefs = await UserPreferences.findOne({ userId });
    if (existingPrefs) {
      throw new Error('User preferences already exist');
    }

    // Create complete manual preferences with defaults
    const completeManualPrefs: { [K in CuisineType]: number } = {} as any;
    for (const cuisine of CUISINES) {
      completeManualPrefs[cuisine] = initialManualPreferences[cuisine] || 0; // Default to 0 (neutral)
    }
    
    const userPrefs = new UserPreferences({
      userId,
      manualPreferences: completeManualPrefs,
      // hiddenAdjustments default to 0 (from schema)
      totalRatings: 0,
      adaptationRate: 0.3
    });
    
    await userPrefs.save();
    return userPrefs;
  } catch (error: any) {
    throw new Error(`Failed to initialize user preferences: ${error.message}`);
  }
};

export const getUserPreferences = async (userId: string): Promise<IUserPreferences | null> => {
  return await UserPreferences.findOne({ userId });
};