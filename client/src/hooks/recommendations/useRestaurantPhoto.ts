// client/src/hooks/useRestaurantPhoto.ts
import { useState, useEffect } from 'react';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';

interface UseRestaurantPhotoParams {
  photoReference?: string;
  maxWidth?: number;
  maxHeight?: number;
}

interface UseRestaurantPhotoReturn {
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
  hasPhoto: boolean;
}

export const useRestaurantPhoto = ({
  photoReference,
  maxWidth = 400,
  maxHeight
}: UseRestaurantPhotoParams): UseRestaurantPhotoReturn => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const axiosPrivate = useAxiosPrivate();
  const hasPhoto = !!photoReference;

  useEffect(() => {
    if (!photoReference) {
      setPhotoUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPhoto = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const queryParams = new URLSearchParams({
          maxWidth: maxWidth.toString(),
        });

        if (maxHeight) {
          queryParams.append('maxHeight', maxHeight.toString());
        }

        // Create the photo URL using your backend endpoint
        const url = `/google/photo/${photoReference}?${queryParams}`;
        
        // Test if the URL is accessible
        const response = await axiosPrivate.get(url, {
          responseType: 'blob', // Get as blob to check if it's valid
        });

        if (response.status === 200) {
          // Create object URL from blob for display
          const blob = response.data;
          const objectUrl = URL.createObjectURL(blob);
          setPhotoUrl(objectUrl);
        } else {
          throw new Error('Failed to load photo');
        }
      } catch (err: any) {
        console.error('Photo fetch error:', err);
        setError('Failed to load photo');
        setPhotoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();

    // Cleanup function to revoke object URL
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoReference, maxWidth, maxHeight]);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  return {
    photoUrl,
    loading,
    error,
    hasPhoto,
  };
};