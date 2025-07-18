import { User } from '../users/userModel.js';
import { Group } from '../groups/groupModel.js';
import { CUISINES, CuisineType } from './types.js';

interface GooglePlace {
    place_id: string;
    name: string;
    vicinity?: string;
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
    business_status?: string;
}

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
}

export const calculatePersonalizedScore = async (
    userId: string,
    cuisine: CuisineType,
    googleRating: number
): Promise<number> => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const manualPreference = user.preferences.get(cuisine) || 3;
    const weight = user.cuisineWeights?.get(cuisine) || 1.0;
    const cuisineScore = manualPreference * weight;
    const finalScore = (googleRating * 0.3) + (cuisineScore * 0.7);

    return Math.max(1, Math.min(5, finalScore));
};

export const getPersonalTopCuisines = async (userId: string): Promise<Array<{ cuisine: string, score: number }>> => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const topCuisines: Array<{ cuisine: string, score: number }> = [];

    for (const cuisine of CUISINES) {
        const preference = user.preferences.get(cuisine) || 3;
        const weight = user.cuisineWeights?.get(cuisine) || 1.0;
        const score = preference * weight;

        topCuisines.push({
            cuisine,
            score: Number(score.toFixed(2))
        });
    }

    return topCuisines
        .sort((a, b) => b.score - a.score)
        .slice(0, 6); // Return top 6 for flexibility
};

export const getGroupTopCuisines = async (groupId: string): Promise<Array<{ cuisine: string, score: number }>> => {
    const group = await Group.findById(groupId).populate('users.user');
    if (!group) throw new Error('Group not found');

    const userIds = group.users.map(member => member.user._id);
    const users = await User.find({ _id: { $in: userIds } });

    const topCuisines: Array<{ cuisine: string, score: number }> = [];

    for (const cuisine of CUISINES) {
        let totalScore = 0;
        let memberCount = 0;

        for (const user of users) {
            const preference = user.preferences.get(cuisine) || 3;
            const weight = user.cuisineWeights?.get(cuisine) || 1.0;
            const userScore = preference * weight;

            totalScore += userScore;
            memberCount++;
        }

        const avgScore = memberCount > 0 ? totalScore / memberCount : 3;

        topCuisines.push({
            cuisine,
            score: Number(avgScore.toFixed(2))
        });
    }

    return topCuisines
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
};

export const getPersonalRestaurantRecommendations = async (
    userId: string,
    googlePlaces: GooglePlace[],
    cuisine: CuisineType,
    limit: number = 4
): Promise<RestaurantRecommendation[]> => {
    const recommendations: RestaurantRecommendation[] = [];

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const manualPreference = user.preferences.get(cuisine) || 3;
    const weight = user.cuisineWeights?.get(cuisine) || 1.0;
    const cuisineScore = manualPreference * weight;

    for (const place of googlePlaces) {
        try {
            const googleRating = place.rating || 3.0;
            const combinedScore = await calculatePersonalizedScore(userId, cuisine, googleRating);
            const reasoning = `Your ${cuisine} preference (${manualPreference.toFixed(1)}/5) × weight (${weight.toFixed(2)}) + restaurant rating (${googleRating.toFixed(1)}/5)`;

            const recommendation: RestaurantRecommendation = {
                place_id: place.place_id,
                name: place.name,
                vicinity: place.vicinity || 'Location not available',
                rating: place.rating,
                price_level: place.price_level,
                geometry: place.geometry,
                photos: place.photos,
                types: place.types,
                cuisine,
                cuisineScore: Number(cuisineScore.toFixed(2)),
                combinedScore: Number(combinedScore.toFixed(2)),
                reasoning
            };

            recommendations.push(recommendation);

        } catch (error) {
            console.error(`Error processing restaurant ${place.name}:`, error);
        }
    }

    const sortedRecommendations = recommendations
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit);

    return sortedRecommendations;
};

export const getGroupRestaurantRecommendations = async (
    groupId: string,
    googlePlaces: GooglePlace[],
    cuisine: CuisineType,
    limit: number = 4
): Promise<RestaurantRecommendation[]> => {
    const recommendations: RestaurantRecommendation[] = [];

    const group = await Group.findById(groupId).populate('users.user');
    if (!group) throw new Error('Group not found');

    const userIds = group.users.map(member => member.user._id);
    const users = await User.find({ _id: { $in: userIds } });

    let totalPreference = 0;
    let totalWeight = 0;
    let memberCount = 0;

    for (const user of users) {
        const preference = user.preferences.get(cuisine) || 3;
        const weight = user.cuisineWeights?.get(cuisine) || 1.0;

        totalPreference += preference;
        totalWeight += weight;
        memberCount++;
    }

    const avgPreference = memberCount > 0 ? totalPreference / memberCount : 3;
    const avgWeight = memberCount > 0 ? totalWeight / memberCount : 1.0;
    const groupCuisineScore = avgPreference * avgWeight;

    for (const place of googlePlaces) {
        try {
            const googleRating = place.rating || 3.0;
            const combinedScore = (googleRating * 0.3) + (groupCuisineScore * 0.7);
            const finalScore = Math.max(1, Math.min(5, combinedScore));
            const reasoning = `Group ${cuisine} preference (${avgPreference.toFixed(1)}/5 avg) × weight (${avgWeight.toFixed(2)} avg) + restaurant rating (${googleRating.toFixed(1)}/5)`;

            const recommendation: RestaurantRecommendation = {
                place_id: place.place_id,
                name: place.name,
                vicinity: place.vicinity || 'Location not available',
                rating: place.rating,
                price_level: place.price_level,
                geometry: place.geometry,
                photos: place.photos,
                types: place.types,
                cuisine,
                cuisineScore: Number(groupCuisineScore.toFixed(2)),
                combinedScore: Number(finalScore.toFixed(2)),
                reasoning
            };

            recommendations.push(recommendation);

        } catch (error) {
            console.error(`Error processing restaurant ${place.name}:`, error);
        }
    }

    const sortedRecommendations = recommendations
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit);

    return sortedRecommendations;
};

export const updateWeightsAfterRating = async (
    userId: string,
    restaurantId: string,
    cuisine: CuisineType,
    actualRating: number,
    googleRating: number
): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const predictedScore = await calculatePersonalizedScore(userId, cuisine, googleRating);
    const error = actualRating - predictedScore;
    const currentWeight = user.cuisineWeights?.get(cuisine) || 1.0;
    let newWeight = currentWeight;

    if (error > 1.0) {
        newWeight += 0.15;
    } else if (error > 0.5) {
        newWeight += 0.08;
    } else if (error < -1.0) {
        newWeight -= 0.15;
    } else if (error < -0.5) {
        newWeight -= 0.08;
    }

    newWeight = Math.max(0.5, Math.min(1.5, newWeight));

    if (!user.cuisineWeights) {
        user.cuisineWeights = new Map();
    }

    user.cuisineWeights.set(cuisine, newWeight);
    await user.save();

    console.log(`Updated ${cuisine} weight for user ${userId}: ${currentWeight.toFixed(3)} → ${newWeight.toFixed(3)} (error: ${error.toFixed(2)})`);
};