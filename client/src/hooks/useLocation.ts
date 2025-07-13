// client/src/hooks/useLocation.ts
import { useState, useCallback, useEffect } from 'react';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface LocationState {
  location: LocationCoords | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

export interface UseLocationReturn extends LocationState {
  getCurrentLocation: () => void;
  clearLocation: () => void;
  clearError: () => void;
}

const SINGAPORE_DEFAULT: LocationCoords = {
  lat: 1.3521,
  lng: 103.8198
};

export const useLocation = (autoRequest: boolean = true): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setHasPermission(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setHasPermission(true);
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to retrieve your location.';
        let recoveryInstructions = '';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access was denied.';
            recoveryInstructions = 'To enable location: click the location icon in your browser\'s address bar, or check your browser settings.';
            setHasPermission(false);
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            recoveryInstructions = 'Please check your internet connection and try again.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out.';
            recoveryInstructions = 'This might be due to a slow connection. Try again.';
            break;
          default:
            errorMessage = `Error: ${err.message}`;
            recoveryInstructions = 'Please try again or check your browser settings.';
            break;
        }
        
        setError(`${errorMessage} ${recoveryInstructions}`);
        setHasPermission(false);
        setLoading(false);
        
        setLocation(SINGAPORE_DEFAULT);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    setHasPermission(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoRequest && navigator.geolocation) {
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' })
          .then((permissionStatus) => {
            if (permissionStatus.state === 'granted') {
              getCurrentLocation();
            } else if (permissionStatus.state === 'prompt') {
              getCurrentLocation();
            }
          })
          .catch(() => {
            getCurrentLocation();
          });
      } else {
        getCurrentLocation();
      }
    }
  }, [autoRequest, getCurrentLocation]);

  return {
    location,
    loading,
    error,
    hasPermission,
    getCurrentLocation,
    clearLocation,
    clearError,
  };
};