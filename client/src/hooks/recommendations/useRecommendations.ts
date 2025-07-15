// client/src/hooks/recommendations/useRecommendations.ts
import { useQuery } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';

export const CUISINES = [
  'Chinese', 'Korean', 'Japanese', 'Italian', 'Mexican', 
  'Indian', 'Thai', 'French', 'Muslim', 'Vietnamese', 'Western', 'Fast Food'
] as const;

export type CuisineType = typeof CUISINES[number];

interface LocationCoords {
  lat: number;
  lng: number;
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


// Hook for intelligent cuisine selection and recommendations
export const useSmartRecommendations = ({
  location,
  count,
  enabled = true,
  isGroupMode = false,
  groupId
}: {
  location: LocationCoords;
  count: number;
  enabled?: boolean;
  isGroupMode?: boolean;
  groupId?: string;
}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['smartRecommendations', location.lat, location.lng, count, isGroupMode, groupId],
    queryFn: async (): Promise<{
      restaurants: RestaurantRecommendation[];
      userAdaptationLevel: string;
      totalRatings: number;
      filterCriteria: {
        eligibleCuisines: string[];
        minCuisineScore: number;
        distribution: Record<string, number>;
      };
      generatedAt: string;
    }> => {
      // Step 1: Get user's top cuisines by calling a new endpoint
      const topCuisinesResponse = await axiosPrivate.get('/recommendations/top-cuisines', {
        params: isGroupMode && groupId ? { groupId } : {}
      });
      const topCuisines: Array<{cuisine: string, score: number}> = topCuisinesResponse.data.data.topCuisines;

      // Step 2: Calculate distribution based on count
      const distribution = calculateCuisineDistribution(count, topCuisines);
      
      // Step 3: Fetch restaurants for each cuisine according to distribution
      const allRestaurants: RestaurantRecommendation[] = [];
      
      for (const [cuisine, restaurantCount] of Object.entries(distribution)) {
        try {
          const endpoint = isGroupMode && groupId 
            ? `/recommendations/group/${groupId}` 
            : '/recommendations/personal';
            
          const queryParams = new URLSearchParams({
            lat: location.lat.toString(),
            lng: location.lng.toString(),
            cuisine: cuisine,
            limit: restaurantCount.toString(),
            radius: '2000'
          });

          const response = await axiosPrivate.get(`${endpoint}?${queryParams}`);
          const restaurants = response.data.data.restaurants || [];
          
          // Add cuisine info and sort by score
          const cuisineRestaurants = restaurants
            .slice(0, restaurantCount)
            .map((restaurant: RestaurantRecommendation) => ({
              ...restaurant,
              _cuisineScore: restaurant.combinedScore || 0
            }));
            
          allRestaurants.push(...cuisineRestaurants);
        } catch (error) {
          console.error(`Failed to fetch ${cuisine} restaurants:`, error);
        }
      }

      // Step 4: Sort all restaurants by combined score and maintain order
      const sortedRestaurants = allRestaurants
        .sort((a, b) => (b.cuisineScore || 0) - (a.cuisineScore || 0))
        .slice(0, count);

      return {
        restaurants: sortedRestaurants,
        userAdaptationLevel: 'learning',
        totalRatings: 0,
        filterCriteria: {
          eligibleCuisines: Object.keys(distribution),
          minCuisineScore: 2.0,
          distribution
        },
        generatedAt: new Date().toISOString()
      };
    },
    enabled: enabled && !!(location.lat && location.lng && count > 0),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Algorithm to distribute restaurants across top cuisines
function calculateCuisineDistribution(count: number, topCuisines: Array<{cuisine: string, score: number}>): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  if (count === 1) {
    // Top 1 cuisine gets 1 restaurant
    distribution[topCuisines[0]?.cuisine] = 1;
  } else if (count === 2) {
    // Top 2 cuisines get 1 each
    distribution[topCuisines[0]?.cuisine] = 1;
    distribution[topCuisines[1]?.cuisine] = 1;
  } else if (count === 3) {
    // Top 3 cuisines get 1 each
    distribution[topCuisines[0]?.cuisine] = 1;
    distribution[topCuisines[1]?.cuisine] = 1;
    distribution[topCuisines[2]?.cuisine] = 1;
  } else if (count === 4) {
    // Top 3 cuisines, top 1 gets 2 restaurants
    distribution[topCuisines[0]?.cuisine] = 2;
    distribution[topCuisines[1]?.cuisine] = 1;
    distribution[topCuisines[2]?.cuisine] = 1;
  } else if (count === 5) {
    // Top 3 cuisines, top 2 get 2 restaurants each
    distribution[topCuisines[0]?.cuisine] = 2;
    distribution[topCuisines[1]?.cuisine] = 2;
    distribution[topCuisines[2]?.cuisine] = 1;
  } else {
    // For 6+: distribute evenly across top 3, giving extra to top cuisines
    const baseCuisines = Math.min(3, topCuisines.length);
    const baseCount = Math.floor(count / baseCuisines);
    const extraCount = count % baseCuisines;
    
    for (let i = 0; i < baseCuisines; i++) {
      const cuisine = topCuisines[i]?.cuisine;
      if (cuisine) {
        distribution[cuisine] = baseCount + (i < extraCount ? 1 : 0);
      }
    }
  }
  
  return distribution;
}