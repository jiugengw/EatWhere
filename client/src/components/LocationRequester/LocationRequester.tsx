// client/src/components/LocationRequester/LocationRequester.tsx
import React from 'react';
import { Button, Text, Group, Alert, Stack } from '@mantine/core';
import { IconMapPin, IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useLocation } from '@/hooks/useLocation';

interface LocationRequesterProps {
  onLocationChange?: (location: { lat: number; lng: number } | null) => void;
  showCoordinates?: boolean;
  variant?: 'button' | 'card';
}

export const LocationRequester: React.FC<LocationRequesterProps> = ({
  onLocationChange,
  showCoordinates = false,
  variant = 'button'
}) => {
  const { 
    location, 
    loading, 
    error, 
    hasPermission, 
    getCurrentLocation, 
    clearError 
  } = useLocation();

  // Notify parent component when location changes
  React.useEffect(() => {
    if (onLocationChange) {
      onLocationChange(location);
    }
  }, [location, onLocationChange]);

  const getLocationStatus = () => {
    if (loading) return 'Getting your location...';
    if (error) return error;
    if (location) {
      if (location.lat === 1.3521 && location.lng === 103.8198) {
        return 'Using default location (Singapore)';
      }
      return 'Location detected successfully';
    }
    return 'Location not requested yet';
  };

  const getLocationAccuracy = () => {
    if (!location) return null;
    
    // Check if it's the default Singapore location
    if (location.lat === 1.3521 && location.lng === 103.8198) {
      return 'default';
    }
    return 'accurate';
  };

  if (variant === 'card') {
    return (
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconMapPin size={20} color={location ? 'green' : 'gray'} />
            <Text size="sm" fw={500}>Location Services</Text>
          </Group>
          
          <Button
            size="xs"
            variant={location ? 'light' : 'filled'}
            loading={loading}
            onClick={getCurrentLocation}
            leftSection={hasPermission === false ? <IconRefresh size={14} /> : undefined}
          >
            {hasPermission === false ? 'Retry' : location ? 'Update' : 'Enable'}
          </Button>
        </Group>

        <Text size="xs" c="dimmed">
          {getLocationStatus()}
        </Text>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            color="orange" 
            variant="light"
          >
            {error}
          </Alert>
        )}

        {location && showCoordinates && (
          <Text size="xs" c="dimmed" ff="monospace">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            {getLocationAccuracy() === 'default' && ' (default)'}
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      <Button
        onClick={getCurrentLocation}
        loading={loading}
        leftSection={<IconMapPin size={16} />}
        variant={location ? 'light' : 'filled'}
        color={hasPermission === false ? 'orange' : 'blue'}
      >
        {loading ? 'Getting Location...' : 
         hasPermission === false ? 'Retry Location' :
         location ? 'Update Location' : 'Get My Location'}
      </Button>

      {location && (
        <Alert color="green" variant="light">
          <Text size="sm">
            📍 Location {getLocationAccuracy() === 'default' ? 'set to Singapore (default)' : 'detected successfully'}
          </Text>
          {showCoordinates && (
            <Text size="xs" c="dimmed" mt="xs" ff="monospace">
              Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </Text>
          )}
        </Alert>
      )}

      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          color="orange"
          onClose={clearError}
          withCloseButton
        >
          {error}
        </Alert>
      )}
    </Stack>
  );
};