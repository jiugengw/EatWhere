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

        const queryParams = new URLSearchParams({
          maxWidth: maxWidth.toString(),
        });

        if (maxHeight) {
          queryParams.append('maxHeight', maxHeight.toString());
        }

        const url = `/google/photo/${photoReference}?${queryParams}`;
        
        const response = await axiosPrivate.get(url, {
          responseType: 'blob', 
        });

        if (response.status === 200) {
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

    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoReference, maxWidth, maxHeight]);

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