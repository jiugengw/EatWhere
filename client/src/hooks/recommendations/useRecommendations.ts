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
      const topCuisinesResponse = await axiosPrivate.get('/recommendations/top-cuisines', {
        params: isGroupMode && groupId ? { groupId } : {}
      });
      const topCuisines: Array<{cuisine: string, score: number}> = topCuisinesResponse.data.data.topCuisines;

      const distribution = calculateCuisineDistribution(count, topCuisines);
      
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

function calculateCuisineDistribution(count: number, topCuisines: Array<{cuisine: string, score: number}>): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  if (count === 1) {
    distribution[topCuisines[0]?.cuisine] = 1;
  } else if (count === 2) {
    distribution[topCuisines[0]?.cuisine] = 1;
    distribution[topCuisines[1]?.cuisine] = 1;
  } else if (count === 3) {
    distribution[topCuisines[0]?.cuisine] = 1;
    distribution[topCuisines[1]?.cuisine] = 1;
    distribution[topCuisines[2]?.cuisine] = 1;
  } else if (count === 4) {
    distribution[topCuisines[0]?.cuisine] = 2;
    distribution[topCuisines[1]?.cuisine] = 1;
    distribution[topCuisines[2]?.cuisine] = 1;
  } else if (count === 5) {
    distribution[topCuisines[0]?.cuisine] = 2;
    distribution[topCuisines[1]?.cuisine] = 2;
    distribution[topCuisines[2]?.cuisine] = 1;
  } else {
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