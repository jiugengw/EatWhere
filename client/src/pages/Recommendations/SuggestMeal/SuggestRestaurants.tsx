import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  SimpleGrid,
  Slider,
  Badge,
  ActionIcon,
  Flex,
  Skeleton,
  Alert,
} from '@mantine/core';
import { IconArrowLeft, IconRefresh, IconStar, IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useLocation } from '@/hooks/useLocation';
import { useRestaurantRecommendations } from '@/hooks/recommendations/useRestaurantRecommendations';
import { RestaurantCard } from '@/components/RestaurantCard/RestaurantCard';
import { type RestaurantResult } from '@/hooks/recommendations/useCuisineRecommendations';
import classes from './SuggestRestaurants.module.css';

export function SuggestRestaurantsPage() {
  const navigate = useNavigate();
  const [restaurantCount, setRestaurantCount] = useState(5);
  const [hasGenerated, setHasGenerated] = useState(false);

  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();

  const {
    data,
    restaurants,
    isLoading: restaurantsLoading,
    error: restaurantsError,
    refetch
  } = useRestaurantRecommendations({
    lat: location?.lat || 1.3521,
    lng: location?.lng || 103.8198,
    limit: restaurantCount,
    enabled: hasGenerated
  });

  const handleBack = () => {
    navigate({ to: '/recommendations/find-meal' });
  };

  const handleGenerateRestaurants = () => {
    if (!location && !locationError) {
      getCurrentLocation();
    }
    setHasGenerated(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const transformToRestaurantResult = (suggestedRestaurant: any): RestaurantResult => {
    return {
      place_id: suggestedRestaurant.place_id,
      name: suggestedRestaurant.name,
      vicinity: suggestedRestaurant.vicinity || 'Location not available',
      rating: suggestedRestaurant.rating,
      price_level: suggestedRestaurant.price_level,
      photos: suggestedRestaurant.photos || [],
      geometry: suggestedRestaurant.geometry || {
        location: {
          lat: location?.lat || 1.3521,
          lng: location?.lng || 103.8198
        }
      },
      types: [
        suggestedRestaurant.cuisine?.toLowerCase() || 'restaurant',
        'restaurant',
        'food',
        'establishment'
      ],
      business_status: 'OPERATIONAL',
      opening_hours: undefined // Suggested restaurants don't have opening hours data
    };
  };

  const isLoading = locationLoading || restaurantsLoading;

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Stack gap="xl">
        <Paper withBorder p="lg" radius="md" className={classes.header}>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={handleBack}
                className={classes.backButton}
              >
                <IconArrowLeft size={20} />
              </ActionIcon>
              <div>
                <Title order={2} className={classes.title}>
                  Restaurant Suggestions
                </Title>
                <Text c="dimmed" className={classes.subtitle}>
                  Personalized restaurant recommendations based on your cuisine preferences
                </Text>
              </div>
            </Group>

            {hasGenerated && (
              <ActionIcon
                variant="light"
                size="lg"
                onClick={handleRefresh}
                disabled={isLoading}
                className={classes.refreshButton}
              >
                <IconRefresh size={18} />
              </ActionIcon>
            )}
          </Group>
        </Paper>

        {locationError && (
          <Alert icon={<IconInfoCircle size={16} />} color="orange" title="Location Error">
            {locationError}
            <Button size="xs" mt="sm" onClick={getCurrentLocation}>
              Retry Location
            </Button>
          </Alert>
        )}

        {!hasGenerated ? (
          <Paper withBorder p="xl" radius="md" className={classes.setupCard}>
            <Stack gap="lg" align="center">
              <div className={classes.sliderSection}>
                <Text size="lg" fw={500} mb="md" className={classes.sliderLabel}>
                  How many restaurants would you like to see?
                </Text>
                <div className={classes.sliderContainer}>
                  <Slider
                    value={restaurantCount}
                    onChange={setRestaurantCount}
                    min={1}
                    max={10}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 3, label: '3' },
                      { value: 5, label: '5' },
                      { value: 7, label: '7' },
                      { value: 10, label: '10' },
                    ]}
                    className={classes.slider}
                  />
                </div>
                <Group justify="center" mt="md">
                  <Badge size="lg" variant="light" color="blue" className={classes.countBadge}>
                    {restaurantCount} restaurant{restaurantCount !== 1 ? 's' : ''}
                  </Badge>
                </Group>
              </div>

              <Button
                size="xl"
                onClick={handleGenerateRestaurants}
                loading={isLoading}
                className={classes.generateButton}
                leftSection={<IconStar size={20} />}
              >
                {isLoading ? 'Finding restaurants...' : 'Find My Restaurants'}
              </Button>

              {location && (
                <Text size="xs" c="dimmed">
                  Searching near: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </Text>
              )}
            </Stack>
          </Paper>
        ) : (
          <Stack gap="lg">
            <Paper withBorder p="md" radius="md" className={classes.resultsHeader}>
              <Flex justify="space-between" align="center">
                <div>
                  <Text size="lg" fw={500} className={classes.resultsTitle}>
                    Your Restaurant Recommendations
                  </Text>
                  <Text size="sm" c="dimmed">
                    {restaurants.length} restaurants found based on your cuisine preferences
                  </Text>
                  {data && (
                    <Group gap="xs" mt="xs">
                      <Badge variant="light" color="blue" size="xs">
                        {data.userAdaptationLevel} user
                      </Badge>
                      <Badge variant="light" color="green" size="xs">
                        {data.totalRatings} ratings given
                      </Badge>
                      <Badge variant="light" color="orange" size="xs">
                        {data.filterCriteria?.eligibleCuisines?.length || 0} cuisines considered
                      </Badge>
                    </Group>
                  )}
                </div>
                <Group gap="xs">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => {
                      setHasGenerated(false);
                    }}
                    className={classes.newSuggestionsButton}
                  >
                    New Search
                  </Button>
                </Group>
              </Flex>
            </Paper>

            {restaurantsError && (
              <Alert icon={<IconInfoCircle size={16} />} color="red" title="Error">
                Failed to load restaurants. Please try again.
              </Alert>
            )}

            {isLoading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {Array.from({ length: restaurantCount }).map((_, index) => (
                  <Skeleton key={index} height={400} radius="md" />
                ))}
              </SimpleGrid>
            ) : restaurants.length === 0 ? (
              <Alert icon={<IconInfoCircle size={16} />} color="blue" title="No restaurants found">
                Try adjusting your location or preferences. We couldn't find restaurants matching your taste profile in this area.
              </Alert>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {restaurants.map((restaurant) => (
                  <div key={restaurant.place_id} className={classes.restaurantCardWrapper}>
                    <RestaurantCard
                      restaurant={transformToRestaurantResult(restaurant)}
                    />
                    {/* Additional suggestion metadata overlay */}
                    <div className={classes.suggestionBadges}>
                      <Badge variant="light" color="orange" size="xs">
                        {restaurant.cuisine}
                      </Badge>
                      <Badge variant="light" color="blue" size="xs">
                        {restaurant.cuisineScore?.toFixed(1)}★ match
                      </Badge>
                      {restaurant.combinedScore && (
                        <Badge variant="light" color="green" size="xs">
                          {restaurant.combinedScore.toFixed(2)} score
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </SimpleGrid>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}