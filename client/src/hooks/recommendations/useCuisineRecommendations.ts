// client/src/hooks/recommendations/useCuisineRecommendation.ts
import { useState, useEffect } from 'react';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';
import { useLocation, type LocationCoords } from '@/hooks/useLocation';

// Types based on your existing backend types
export const CUISINES = [
  'Chinese', 'Korean', 'Japanese', 'Italian', 'Mexican', 
  'Indian', 'Thai', 'French', 'Muslim', 'Vietnamese', 'Western', 'Fast Food'
] as const;

export type CuisineType = typeof CUISINES[number];

// Restaurant/Eatery interface for Google Places API response
export interface RestaurantResult {
  place_id: string;
  name: string;
  vicinity?: string; // Made optional since Google might not always include this
  rating?: number;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now: boolean;
  };
  types: string[];
  business_status?: string; // Added this field from Google API
  icon?: string; // Added this field from Google API
  icon_background_color?: string; // Added this field from Google API
  icon_mask_base_uri?: string; // Added this field from Google API
}

export interface CuisineRestaurantsResponse {
  results: RestaurantResult[];
  status: string;
  next_page_token?: string;
}

interface CuisineRecommendationsParams {
  cuisine: CuisineType;
  limit?: number;
  customLocation?: LocationCoords;
  useCurrentLocation?: boolean;
}

interface UseCuisineRecommendationsReturn {
  restaurants: RestaurantResult[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  locationUsed: LocationCoords | null;
  locationLoading: boolean;
  locationError: string | null;
  requestLocation: () => void;
}

export const useCuisineRecommendations = ({ 
  cuisine, 
  limit = 10,
  customLocation,
  useCurrentLocation = true
}: CuisineRecommendationsParams): UseCuisineRecommendationsReturn => {
  const [restaurants, setRestaurants] = useState<RestaurantResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const axiosPrivate = useAxiosPrivate();
  
  // Use location hook only if useCurrentLocation is true
  const locationHook = useLocation(useCurrentLocation);
  const { 
    location: currentLocation, 
    loading: locationLoading, 
    error: locationError,
    getCurrentLocation 
  } = locationHook;

  // Determine which location to use
  const getLocationToUse = (): LocationCoords => {
    if (customLocation) return customLocation;
    if (currentLocation) return currentLocation;
    // Default fallback to Singapore
    return { lat: 1.3521, lng: 103.8198 };
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const locationToUse = getLocationToUse();
      
      const queryParams = new URLSearchParams({
        lat: locationToUse.lat.toString(),
        lng: locationToUse.lng.toString(),
        keyword: `${cuisine} restaurant`,
        radius: '2000',
        type: 'restaurant'
      });

      if (limit) {
        queryParams.append('limit', limit.toString());
      }

      const response = await axiosPrivate.get(`/google/places?${queryParams}`);
      
      const results = response.data.data?.results || 
                     response.data.results || 
                     response.data || 
                     [];
      
      setRestaurants(results);
      
    } catch (err: any) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch restaurants';
      setError(errorMessage);
      setRestaurants([]); // Clear restaurants on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cuisine) return;

    // If we're using current location, wait for it to be available
    if (useCurrentLocation && !currentLocation && !locationError) {
      return;
    }
    
    fetchRestaurants();
  }, [cuisine, limit, currentLocation, customLocation]);

  const refetch = () => {
    console.log('🔄 Manual refetch triggered');
    fetchRestaurants();
  };

  const requestLocation = () => {
    if (useCurrentLocation) {
      console.log('📍 Manual location request');
      getCurrentLocation();
    }
  };

  return {
    restaurants,
    loading: loading || (useCurrentLocation && locationLoading && !currentLocation),
    error: error || (useCurrentLocation ? locationError : null),
    refetch,
    locationUsed: getLocationToUse(),
    locationLoading: useCurrentLocation ? locationLoading : false,
    locationError: useCurrentLocation ? locationError : null,
    requestLocation,
  };
};