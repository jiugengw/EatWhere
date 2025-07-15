// client/src/pages/Discover/Discover.tsx
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
  Select,
  Tooltip,
} from '@mantine/core';
import { IconRefresh, IconStar, IconInfoCircle, IconUsers, IconUser } from '@tabler/icons-react';
import { useLocation } from '@/hooks/useLocation';
import { 
  useSmartRecommendations
} from '@/hooks/recommendations/useRecommendations';
import { RestaurantCard } from '@/components/RestaurantCard/RestaurantCard';
import { useLocation as useRouterLocation, useNavigate } from '@tanstack/react-router';
import { useViewGroups } from '@/hooks/groups/useViewGroups';
import classes from './Discover.module.css'

export function DiscoverPage() {
  const [restaurantCount, setRestaurantCount] = useState(5);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  
  // Check if this is group recommendations
  const isGroupMode = searchParams.get('type') === 'group';
  const groupId = searchParams.get('groupId') || selectedGroupId;

  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();
  const { data: groupsData } = useViewGroups();

  // Reset hasGenerated when switching modes or when first loading
  const resetOnModeChange = () => {
    setHasGenerated(false);
    setRestaurantCount(5); // Reset slider to default
  };

  // Toggle between personal and group mode
  const toggleMode = () => {
    const newMode = isGroupMode ? 'personal' : 'group';
    if (newMode === 'personal') {
      navigate({ to: '/discover' });
    } else {
      navigate({ to: '/discover', search: { type: 'group' } });
    }
    resetOnModeChange();
  };

  // Use smart recommendations that auto-select cuisines
  const {
    data,
    isLoading: restaurantsLoading,
    error: restaurantsError,
    refetch
  } = useSmartRecommendations({
    location: { lat: location?.lat || 1.3521, lng: location?.lng || 103.8198 },
    count: restaurantCount,
    enabled: hasGenerated,
    isGroupMode: isGroupMode,
    groupId: isGroupMode ? (groupId || '') : undefined
  });

  // Transform the recommendation data to match RestaurantCard expectations
  const restaurants = data?.restaurants?.map(restaurant => ({
    place_id: restaurant.place_id,
    name: restaurant.name,
    vicinity: restaurant.vicinity || 'Location not available',
    rating: restaurant.rating,
    price_level: restaurant.price_level,
    photos: restaurant.photos || [],
    geometry: restaurant.geometry,
    types: restaurant.types || [restaurant.cuisine?.toLowerCase() || 'restaurant'],
    business_status: 'OPERATIONAL' as const,
    opening_hours: undefined,
    // Add prediction data for enhanced display
    predictedRating: restaurant.combinedScore,
    suggestedCuisine: restaurant.cuisine
  })) || [];

  const handleGenerateRestaurants = () => {
    if (!location && !locationError) {
      getCurrentLocation();
    }
    setHasGenerated(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const isLoading = locationLoading || restaurantsLoading;

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Stack gap="xl">
        <Paper withBorder p="lg" radius="md" className={classes.header}>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <div>
                <Title order={2} className={classes.title}>
                  {isGroupMode ? 'Group Restaurant Suggestions' : 'Personal Restaurant Suggestions'}
                </Title>
                <Text c="dimmed" className={classes.subtitle}>
                  {isGroupMode
                    ? 'Our recommendations based on your group\'s collective preferences'
                    : 'Personalized restaurant recommendations based on your cuisine preferences'
                  }
                </Text>
              </div>
            </Group>

            <Group gap="sm">
              {/* Mode Toggle Button */}
              <Button
                variant="light"
                leftSection={isGroupMode ? <IconUser size={18} /> : <IconUsers size={18} />}
                onClick={toggleMode}
                className={classes.toggleButton}
              >
                Switch to {isGroupMode ? 'Personal' : 'Group'}
              </Button>

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

        {isGroupMode && !groupId && (
          <Alert icon={<IconInfoCircle size={16} />} color="orange" title="Group Required">
            Please select a group to get group recommendations.
          </Alert>
        )}

        {!hasGenerated ? (
          <Paper withBorder p="xl" radius="md" className={classes.setupCard}>
            <Stack gap="lg" align="center">
              {/* Group Selection - only show if in group mode */}
              {isGroupMode && (
                <div className={classes.groupSelection}>
                  <Text size="lg" fw={500} mb="md" ta="center" className={classes.sliderLabel}>
                    Select a Group
                  </Text>
                  <Select
                    placeholder="Choose a group for recommendations"
                    value={selectedGroupId}
                    onChange={(value) => setSelectedGroupId(value || '')}
                    data={groupsData?.data?.user?.groups?.map(group => ({
                      value: group._id,
                      label: `${group.name} (${group.userCount} members)`
                    })) || []}
                    size="md"
                    searchable
                    clearable
                    nothingFoundMessage="No groups found. Create or join a group first."
                    className={classes.groupSelect}
                  />
                  {groupsData?.data?.user?.groups?.length === 0 && (
                    <Text size="sm" c="dimmed" ta="center" mt="xs">
                      You need to be in a group to get group recommendations.
                    </Text>
                  )}
                </div>
              )}

              {/* Cuisine Selection - show for both modes */}
              {/* Removed - algorithm auto-selects top cuisines */}

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
                disabled={isGroupMode && (!selectedGroupId && !groupId)}
                className={classes.generateButton}
                leftSection={<IconStar size={20} />}
              >
                {isLoading ? 'Finding restaurants...' : `Find ${isGroupMode ? 'Group' : 'My'} Restaurants`}
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
                    Your {isGroupMode ? 'Group' : 'Personal'} Restaurant Recommendations
                  </Text>
                  <Text size="sm" c="dimmed">
                    {restaurants.length} restaurants found from your top cuisines
                  </Text>
                  {data && (
                    <Group gap="xs" mt="xs">
                      <Badge variant="light" color="blue" size="xs">
                        {data.userAdaptationLevel} user
                      </Badge>
                      <Badge variant="light" color="green" size="xs">
                        {data.totalRatings} ratings given
                      </Badge>
                      {data.filterCriteria && (
                        <Badge variant="light" color="orange" size="xs">
                          {data.filterCriteria.eligibleCuisines?.length || 0} cuisines: {data.filterCriteria.eligibleCuisines?.join(', ')}
                        </Badge>
                      )}
                      {data.filterCriteria?.distribution && (
                        <Badge variant="light" color="purple" size="xs">
                          Distribution: {Object.entries(data.filterCriteria.distribution).map(([cuisine, count]) => `${cuisine}(${count})`).join(', ')}
                        </Badge>
                      )}
                    </Group>
                  )}
                </div>
                <Group gap="xs">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={resetOnModeChange}
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
                {restaurants.map((restaurant, index) => {
                  const restaurantData = data?.restaurants?.[index];
                  return (
                    <div key={restaurant.place_id} className={classes.restaurantCardWrapper}>
                      <RestaurantCard
                        restaurant={restaurant}
                      />
                      {/* Enhanced suggestion metadata overlay */}
                      <div className={classes.suggestionBadges}>
                        <Badge variant="light" color="orange" size="xs">
                          {restaurantData?.cuisine}
                        </Badge>
                        <Tooltip
                          label="Our prediction based on your taste preferences"
                          position="top"
                          withArrow
                          color="dark"
                          radius="md"
                          transitionProps={{ duration: 200, transition: 'fade' }}
                          styles={{
                            tooltip: {
                              fontSize: '0.75rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: 'rgba(0, 0, 0, 0.85)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            }
                          }}
                        >
                          <Badge 
                            variant="light" 
                            color="blue" 
                            size="xs"
                            style={{ cursor: 'help' }}
                          >
                            {restaurant.predictedRating?.toFixed(1)}★ predicted
                          </Badge>
                        </Tooltip>
                        {restaurant.rating && (
                          <Badge variant="light" color="green" size="xs">
                            {restaurant.rating.toFixed(1)}★ actual
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </SimpleGrid>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}