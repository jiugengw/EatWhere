import { useQuery } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';

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

interface UseRestaurantRecommendationsParams {
  lat: number;
  lng: number;
  limit: number;
  enabled?: boolean;
}

interface UseRestaurantRecommendationsReturn {
  data: RestaurantRecommendationResponse | undefined;
  restaurants: RestaurantRecommendation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useRestaurantRecommendations = ({
  lat,
  lng,
  limit,
  enabled = true
}: UseRestaurantRecommendationsParams): UseRestaurantRecommendationsReturn => {
  const axiosPrivate = useAxiosPrivate();

  const queryResult = useQuery({
    queryKey: ['restaurantRecommendations', lat, lng, limit],
    queryFn: async (): Promise<RestaurantRecommendationResponse> => {
      const queryParams = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        limit: limit.toString()
      });

      const response = await axiosPrivate.get(`/recommendations/restaurants?${queryParams}`);
      return response.data.data;
    },
    enabled: enabled && !!(lat && lng && limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data: queryResult.data,
    restaurants: queryResult.data?.restaurants || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};