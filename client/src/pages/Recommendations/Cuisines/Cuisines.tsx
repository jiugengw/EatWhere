// client/src/pages/CuisinePage.tsx
import React from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Paper, 
  SimpleGrid, 
  Loader, 
  Alert,
  ActionIcon,
  Flex
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconRefresh, 
  IconInfoCircle, 
  IconMapPin 
} from '@tabler/icons-react';
import { useCuisineRecommendations } from '@/hooks/recommendations/useCuisineRecommendation';
import { type CuisineType, CUISINES } from '@/types/recommendations';
import { LocationRequester } from '@/components/LocationRequester/LocationRequester';
import { RestaurantCard } from '@/components/RestaurantCard/RestaurantCard';

const CuisinePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract search params from TanStack Router location
  const searchParams = new URLSearchParams(location.search);
  const cuisine = searchParams.get('cuisine') as CuisineType;
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const { 
    restaurants, 
    loading, 
    error, 
    refetch, 
    locationUsed,
    locationLoading,
    locationError,
    requestLocation 
  } = useCuisineRecommendations({
    cuisine,
    limit,
    useCurrentLocation: true
  });

  const getLocationDisplay = () => {
    if (!locationUsed) return 'Unknown location';
    
    // Check if it's the default Singapore location
    if (locationUsed.lat === 1.3521 && locationUsed.lng === 103.8198) {
      return 'Singapore (default)';
    }
    
    return `${locationUsed.lat.toFixed(4)}, ${locationUsed.lng.toFixed(4)}`;
  };

  // Validate cuisine parameter
  if (!cuisine || !CUISINES.includes(cuisine)) {
    return (
      <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Stack align="center" gap="lg" style={{ width: '100%' }}>
          <Title order={2} c="red">Invalid Cuisine</Title>
          <Text ta="center" c="dimmed">
            Please provide a valid cuisine type. Available options: {CUISINES.join(', ')}
          </Text>
          <Button onClick={() => navigate({ to: '/recommendations' })}>
            Back to Recommendations
          </Button>
        </Stack>
      </Container>
    );
  }

  if (loading || locationLoading) {
    return (
      <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Stack align="center" gap="lg" style={{ width: '100%' }}>
          <Loader size="lg" />
          <Text ta="center" c="dimmed">
            {locationLoading ? 'Getting your location...' : `Finding ${cuisine} restaurants near you...`}
          </Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Stack align="center" gap="lg" style={{ width: '100%' }}>
          <Alert icon={<IconInfoCircle size={16} />} title="Error" color="red" style={{ width: '100%' }}>
            {error}
          </Alert>
          <Group>
            <Button onClick={refetch}>
              Try Again
            </Button>
            {locationError && (
              <Button color="orange" onClick={requestLocation}>
                Retry Location
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate({ to: '/recommendations' })}>
              Back to Recommendations
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Group>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => navigate({ to: '/recommendations' })}
              >
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Stack gap="xs">
                <Title order={1}>
                  {cuisine} Restaurants
                </Title>
                <Text c="dimmed">
                  Found {restaurants.length} {cuisine} restaurants near your location
                </Text>
              </Stack>
            </Group>
            
            <ActionIcon
              variant="light"
              size="lg"
              onClick={refetch}
              title="Refresh"
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Flex>

          {/* Location Section */}
          <Paper withBorder p="lg" radius="md">
            <Group mb="md">
              <IconMapPin size={20} />
              <Title order={3}>Search Location</Title>
            </Group>
            <LocationRequester 
              variant="card"
              showCoordinates={true}
            />
          </Paper>

          {/* Restaurants Grid */}
          {restaurants && restaurants.length > 0 ? (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3 }}
              spacing="lg"
            >
              {restaurants.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.place_id}
                  restaurant={restaurant}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="md">
              <Stack align="center" gap="lg">
                <Text ta="center" c="dimmed">
                  No {cuisine} restaurants found near {getLocationDisplay()}.
                </Text>
                <Group>
                  <Button onClick={refetch}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={requestLocation}>
                    Update Location
                  </Button>
                </Group>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </div>
  );
};

export default CuisinePage;