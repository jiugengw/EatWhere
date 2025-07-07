import { Group } from '../groups/groupModel.js';
import { User } from '../users/userModel.js';
import { UserRecommendationData, UserRecommendationDoc } from './recommendationModel.js';
import {
    RecommendationRequest,
    RecommendationResponse,
    RecommendationResult,
    CUISINES,
    CuisineType,
    type GroupRecommendationRequest
} from './types.js';

const createDefaultHiddenData = async (userId: string): Promise<UserRecommendationDoc> => {
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

const calculateConfidenceWeight = (totalRatings: number): number => {
    return Math.min(0.9, 0.6 + (totalRatings * 0.01));
};

const calculateExplorationFactor = (
    hiddenData: UserRecommendationDoc,
    baseScore: number
): number => {
    const totalRatings = hiddenData.totalRatings;

    const explorationBonus = totalRatings < 20 ? 0.8 : 0.3;
    const neutralityBonus = Math.abs(baseScore - 2.5) < 0.5 ? 0.4 : 0;

    return explorationBonus + neutralityBonus;
};

const calculateDiversityBonus = (user: any, baseScore: number): number => {
    const manualScores = Array.from(user.preferences.values()) as number[];
    const avgScore = manualScores.reduce((sum, score) => sum + score, 0) / manualScores.length;
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
    const finalScore = (manualScore + hiddenAdjustment) + 3;

    if (Math.abs(hiddenAdjustment) > 0.3) {
        if (hiddenAdjustment > 0) {
            return "You enjoy this more than expected based on your previous ratings";
        } else {
            return "You might enjoy this less than your current preference suggests";
        }
    }

    if (finalScore >= 4) {
        return "This cuisine is a strong match for your established taste profile";
    } else if (finalScore <= 2) {
        return "This cuisine may not align well with your current preferences";
    } else if (explorationFactor > 0.5) {
        return totalRatings < 10 ? "This is a new cuisine that you should definitely explore" : "This cuisine is worth trying again based on your history";
    } else {
        return "This cuisine offers a moderate match for your taste preferences";
    }
};


const getUserAdaptationLevel = (totalRatings: number): string => {
    if (totalRatings < 5) return 'new';
    if (totalRatings < 25) return 'learning';
    return 'established';
};

const calculateAdaptationRate = (totalRatings: number): number => {
    if (totalRatings < 10) return 0.2;
    if (totalRatings < 50) return 0.1;
    return 0.05;
};

const calculateFinalCuisineScores = (user: any, hiddenData: UserRecommendationDoc): RecommendationResult[] => {
    const results: RecommendationResult[] = [];
    const favourites = hiddenData.favourites || [];

    for (const cuisine of CUISINES) {
        const manualScore = user.preferences.get(cuisine) || 0;
        const hiddenAdjustment = hiddenData.hiddenAdjustments[cuisine] || 0;
        const favouriteBonus = favourites.includes(cuisine) ? 0.5 : 0;
        const baseScore = Math.max(1, Math.min(5, (manualScore + hiddenAdjustment + favouriteBonus) + 3));
        const confidenceWeight = calculateConfidenceWeight(hiddenData.totalRatings);
        const explorationFactor = calculateExplorationFactor(hiddenData, baseScore);
        const diversityBonus = calculateDiversityBonus(user, baseScore);

        const finalScore = (
            baseScore * confidenceWeight +
            explorationFactor +
            diversityBonus
        );

        const confidenceLevel = calculateConfidenceLevel(hiddenData.totalRatings, baseScore);
        const reasoning = generateReasoning(
            manualScore,
            hiddenAdjustment,
            explorationFactor,
            hiddenData.totalRatings
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

export const generateRecommendations = async (
    request: RecommendationRequest
): Promise<RecommendationResponse> => {
    const user = await User.findById(request.userId);
    if (!user) {
        throw new Error('User not found');
    }

    let hiddenData = await UserRecommendationData.findOne({ userId: request.userId });
    if (!hiddenData) {
        hiddenData = await createDefaultHiddenData(request.userId);
    }

    const finalScores = calculateFinalCuisineScores(user, hiddenData);

    const recommendations = finalScores
        .sort((a, b) => b.score - a.score)
        .slice(0, request.limit || 5);

    return {
        recommendations,
        userAdaptationLevel: getUserAdaptationLevel(hiddenData.totalRatings),
        totalRatings: hiddenData.totalRatings,
        generatedAt: new Date()
    };
};

export const processRating = async (
    userId: string,
    cuisineName: CuisineType,
    rating: number
): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    let hiddenData = await UserRecommendationData.findOne({ userId });
    if (!hiddenData) {
        hiddenData = await createDefaultHiddenData(userId);
    }

    const manualScore = user.preferences.get(cuisineName) || 0;
    const currentHiddenAdjustment = hiddenData.hiddenAdjustments[cuisineName] || 0;
    const expectedScore = (manualScore + currentHiddenAdjustment) + 3;

    const predictionError = rating - expectedScore;

    const adaptationRate = calculateAdaptationRate(hiddenData.totalRatings);
    const newHiddenAdjustment = currentHiddenAdjustment + (predictionError * adaptationRate);
    const clampedAdjustment = Math.max(-2, Math.min(2, newHiddenAdjustment));

    await UserRecommendationData.findOneAndUpdate(
        { userId },
        {
            $set: {
                [`hiddenAdjustments.${cuisineName}`]: clampedAdjustment,
                totalRatings: hiddenData.totalRatings + 1,
                adaptationRate: calculateAdaptationRate(hiddenData.totalRatings + 1)
            }
        },
        { new: true }
    );
};

export const toggleUserFavourite = async (
    userId: string,
    cuisineName: CuisineType
): Promise<{ isFavourited: boolean }> => {
    let hiddenData = await UserRecommendationData.findOne({ userId });
    if (!hiddenData) {
        hiddenData = await createDefaultHiddenData(userId);
    }

    const favourites = hiddenData.favourites || [];
    const isFavourited = favourites.includes(cuisineName);

    let updatedFavourites;
    if (isFavourited) {
        updatedFavourites = favourites.filter(fav => fav !== cuisineName);
    } else {
        updatedFavourites = [...favourites, cuisineName];
    }

    await UserRecommendationData.findOneAndUpdate(
        { userId },
        { $set: { favourites: updatedFavourites } },
        { new: true }
    );

    return { isFavourited: !isFavourited };
};

export const getUserFavourites = async (userId: string): Promise<string[]> => {
    let hiddenData = await UserRecommendationData.findOne({ userId });
    if (!hiddenData) {
        hiddenData = await createDefaultHiddenData(userId);
    }

    return hiddenData.favourites || [];
};

const calculateDiscoverScores = (user: any, hiddenData: UserRecommendationDoc): RecommendationResult[] => {
    const results: RecommendationResult[] = [];
    const favourites = hiddenData.favourites || [];

    for (const cuisine of CUISINES) {
        const manualScore = user.preferences.get(cuisine) || 0;
        const hiddenAdjustment = hiddenData.hiddenAdjustments[cuisine] || 0;
        const favouriteBonus = favourites.includes(cuisine) ? 0.2 : 0;

        const baseScore = Math.max(1, Math.min(5, (manualScore + hiddenAdjustment + favouriteBonus) + 3));
        const discoveryBonus = Math.random() * 2;
        const explorationWeight = 2.0;

        const finalScore = baseScore * 0.6 + discoveryBonus + explorationWeight;

        const reasoning = generateDiscoverReasoning();

        results.push({
            cuisineName: cuisine,
            score: Math.round(finalScore * 100) / 100,
            discoveryLevel: 0.5,
            reasoning
        });
    }

    return results;
};

const generateDiscoverReasoning = (): string => {
    return "Enhanced for exploration - perfect time to try something new";
};

export const generateDiscoverRecommendations = async (
    request: RecommendationRequest
): Promise<RecommendationResponse> => {
    const user = await User.findById(request.userId);
    if (!user) {
        throw new Error('User not found');
    }

    let hiddenData = await UserRecommendationData.findOne({ userId: request.userId });
    if (!hiddenData) {
        hiddenData = await createDefaultHiddenData(request.userId);
    }

    const finalScores = calculateDiscoverScores(user, hiddenData);

    const shuffledScores = finalScores
        .sort(() => Math.random() - 0.5)
        .slice(0, request.limit || 4);

    return {
        recommendations: shuffledScores,
        userAdaptationLevel: getUserAdaptationLevel(hiddenData.totalRatings),
        totalRatings: hiddenData.totalRatings,
        generatedAt: new Date()
    };
};

const getGroupReasoning = (groupScore: number, memberCount: number): string => {
    const roundedScore = Math.round(groupScore * 10) / 10; // Round to 1 decimal
    
    if (roundedScore >= 1.5) {
        return `Highly favored by your group of ${memberCount} members`;
    } else if (roundedScore >= 0.5) {
        return `Generally liked among your ${memberCount} group members`;
    } else if (roundedScore >= -0.5) {
        return `Mixed preferences among your ${memberCount} group members`;
    } else if (roundedScore >= -1.5) {
        return `Less popular choice among your ${memberCount} group members`;
    } else {
        return `Not preferred by most of your ${memberCount} group members`;
    }
};

export const generateGroupRecommendations = async (
    request: GroupRecommendationRequest
): Promise<RecommendationResponse> => {
    const group = await Group.findById(request.groupId).populate('users.user');
    if (!group) {
        throw new Error('Group not found');
    }

    const userIds = group.users.map(u => u.user._id);
    const users = await User.find({ _id: { $in: userIds } });

    const userRecommendationData = await UserRecommendationData.find({
        userId: { $in: userIds.map(id => id.toString()) }
    });

    const groupPreferences = new Map<string, number>();

    CUISINES.forEach(cuisine => {
        const scores = users.map(user => user.preferences.get(cuisine) || 0);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        groupPreferences.set(cuisine, avgScore);
    });

    const results: RecommendationResult[] = [];

    for (const cuisine of CUISINES) {
        const groupScore = groupPreferences.get(cuisine) || 0;

        const normalizedScore = ((groupScore + 2) / 4) * 4 + 1; 
        const finalScore = Math.max(1, Math.min(5, normalizedScore));
        results.push({
            cuisineName: cuisine,
            score: Math.round(finalScore * 100) / 100,
            confidenceLevel: 0.7,
            reasoning: getGroupReasoning(groupScore, users.length) 
        });
    }

    const recommendations = results
        .sort((a, b) => b.score - a.score)
        .slice(0, request.limit || 5);

    const totalRatings = userRecommendationData.reduce((sum, data) => sum + data.totalRatings, 0);

    return {
        recommendations,
        userAdaptationLevel: 'group',
        totalRatings,
        generatedAt: new Date()
    };
};

export const generateGroupDiscoverRecommendations = async (
  request: GroupRecommendationRequest
): Promise<RecommendationResponse> => {
  const group = await Group.findById(request.groupId).populate('users.user');
  if (!group) {
    throw new Error('Group not found');
  }

  const userIds = group.users.map(u => u.user._id);
  const users = await User.find({ _id: { $in: userIds } });

  const groupPreferences = new Map<string, number>();
  CUISINES.forEach(cuisine => {
    const scores = users.map(user => user.preferences.get(cuisine) || 0);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    groupPreferences.set(cuisine, avgScore);
  });

  const results: RecommendationResult[] = [];
  
  for (const cuisine of CUISINES) {
    const groupScore = groupPreferences.get(cuisine) || 0;
    const baseScore = ((groupScore + 2) / 4) * 4 + 1;
    
    const discoveryBonus = Math.random() * 2;
    const explorationWeight = 1.5;
    const finalScore = baseScore * 0.6 + discoveryBonus + explorationWeight;

    results.push({
      cuisineName: cuisine,
      score: Math.round(finalScore * 100) / 100,
      discoveryLevel: 0.5,
      reasoning: `Great group exploration choice - try something new together!`
    });
  }

  const shuffledResults = results
    .sort(() => Math.random() - 0.5)
    .slice(0, request.limit || 4);

  return {
    recommendations: shuffledResults,
    userAdaptationLevel: 'group',
    totalRatings: 0, 
    generatedAt: new Date()
  };
};