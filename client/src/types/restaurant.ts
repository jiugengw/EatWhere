export interface AIRestaurantResult {
  place_id: string;
  name: string;
  vicinity: string;
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
    } 
  };
  types: string[];
  business_status?: string;
  opening_hours?: { open_now: boolean };
  predictedRating?: number;
  suggestedCuisine?: string;
  reasoning?: string;
}