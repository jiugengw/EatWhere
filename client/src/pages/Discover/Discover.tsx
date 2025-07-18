import { useEffect, useState } from 'react';
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
  TextInput,
} from '@mantine/core';
import {
  IconRefresh,
  IconInfoCircle,
  IconUsers,
  IconUser,
  IconSearch,
  IconSparkles
} from '@tabler/icons-react';
import { useLocation } from '@/hooks/useLocation';
import {
  useSmartRecommendations
} from '@/hooks/recommendations/useRecommendations';
import { RestaurantCard } from '@/components/RestaurantCard/RestaurantCard';
import { useLocation as useRouterLocation, useNavigate } from '@tanstack/react-router';
import { useViewGroups } from '@/hooks/groups/useViewGroups';
import { useDebouncedValue } from '@mantine/hooks';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';
import classes from './Discover.module.css'

export function DiscoverPage() {
  const [restaurantCount, setRestaurantCount] = useState(5);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debouncedSearch] = useDebouncedValue(searchKeyword, 500);

  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const axiosPrivate = useAxiosPrivate();

  const isGroupMode = searchParams.get('type') === 'group';
  const groupId = searchParams.get('groupId') || selectedGroupId;

  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();
  const { data: groupsData } = useViewGroups();


  useEffect(() => {
    const urlGroupId = searchParams.get('groupId');
    if (urlGroupId && isGroupMode) {
      setSelectedGroupId(urlGroupId);
      setHasGenerated(true); 
    }
  }, [searchParams, isGroupMode]);

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim() || !location) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);

      const queryParams = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        keyword: keyword.trim(),
        radius: '2000',
        type: 'restaurant'
      });

      const response = await axiosPrivate.get(`/google/places?${queryParams}`);
      const results = response.data.data?.results || response.data.results || [];

      const transformedResults = results.slice(0, 10).map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        vicinity: place.vicinity || 'Location not available',
        rating: place.rating,
        price_level: place.price_level,
        photos: place.photos || [],
        geometry: place.geometry,
        types: place.types || ['restaurant'],
        business_status: 'OPERATIONAL',
        opening_hours: place.opening_hours,
      }));

      setSearchResults(transformedResults);
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError('Failed to search restaurants');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, location]);

  const clearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setSearchError(null);
  };

  const resetOnModeChange = () => {
    setHasGenerated(false);
    setRestaurantCount(5);
    clearSearch();
  };

  const toggleMode = () => {
    const newMode = isGroupMode ? 'personal' : 'group';
    if (newMode === 'personal') {
      navigate({ to: '/discover' });
    } else {
      navigate({ to: '/discover', search: { type: 'group' } });
    }
    resetOnModeChange();
  };

  const {
    data,
    isLoading: restaurantsLoading,
    error: restaurantsError,
    refetch
  } = useSmartRecommendations({
    location: { lat: location?.lat || 1.3521, lng: location?.lng || 103.8198 },
    count: restaurantCount,
    enabled: hasGenerated && !searchKeyword,
    isGroupMode: isGroupMode,
    groupId: isGroupMode ? (groupId || '') : undefined
  });

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
    predictedRating: restaurant.combinedScore,
    suggestedCuisine: restaurant.cuisine
  })) || [];

  const handleGenerateRestaurants = () => {
    if (!location && !locationError) {
      getCurrentLocation();
    }
    clearSearch(); 
    setHasGenerated(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const isLoading = locationLoading || restaurantsLoading || searchLoading;

  const showSearchResults = searchKeyword && searchResults.length > 0;
  const showRecommendations = hasGenerated && !searchKeyword && restaurants.length > 0;
  const showSetup = !hasGenerated && !searchKeyword;

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Stack gap="xl">
        <Paper withBorder p="lg" radius="md" className={classes.header}>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <div>
                <Title order={2} className={classes.title}>
                  {isGroupMode ? 'Group Restaurant Discovery' : 'Personal Restaurant Discovery'}
                </Title>
                <Text c="dimmed" className={classes.subtitle}>
                  {isGroupMode
                    ? 'Find restaurants your group will love, or search for specific places'
                    : 'Discover your perfect restaurants, or search for specific places'
                  }
                </Text>
              </div>
            </Group>

            <Group gap="sm">
              <Button
                variant="light"
                leftSection={isGroupMode ? <IconUser size={18} /> : <IconUsers size={18} />}
                onClick={toggleMode}
                className={classes.toggleButton}
              >
                Switch to {isGroupMode ? 'Personal' : 'Group'}
              </Button>

              {(hasGenerated || searchKeyword) && (
                <ActionIcon
                  variant="light"
                  size="lg"
                  onClick={searchKeyword ? () => handleSearch(searchKeyword) : handleRefresh}
                  disabled={isLoading}
                  className={classes.refreshButton}
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              )}
            </Group>
          </Group>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group gap="sm" align="center">
              <IconSearch size={20} color="var(--mantine-color-dimmed)" />
              <Text fw={500}>Quick Restaurant Search</Text>
            </Group>

            <TextInput
              placeholder="Search for restaurants, cuisines, or dishes..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.currentTarget.value)}
              size="lg"
              leftSection={<IconSearch size={18} />}
              rightSection={
                searchKeyword ? (
                  <ActionIcon variant="subtle" onClick={clearSearch}>
                    ×
                  </ActionIcon>
                ) : null
              }
              styles={{
                input: {
                  border: '2px solid var(--mantine-color-gray-3)',
                  borderRadius: '12px',
                  '&:focus': {
                    borderColor: '#FF8C42',
                    boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.1)',
                  }
                }
              }}
            />

            {searchLoading && (
              <Text size="sm" c="dimmed">Searching restaurants...</Text>
            )}

            {searchError && (
              <Alert color="red">
                {searchError}
              </Alert>
            )}
          </Stack>
        </Paper>

        {locationError && (
          <Alert icon={<IconInfoCircle size={16} />} color="orange" title="Location Error">
            {locationError}
            <Button size="xs" mt="sm" onClick={getCurrentLocation}>
              Retry Location
            </Button>
          </Alert>
        )}

        {isGroupMode && !groupId && !searchKeyword && (
          <Alert icon={<IconInfoCircle size={16} />} color="orange" title="Group Required">
            Please select a group to get group recommendations.
          </Alert>
        )}

        {showSearchResults && (
          <Stack gap="lg">
            <Paper withBorder p="md" radius="md">
              <Flex justify="space-between" align="center">
                <div>
                  <Text size="lg" fw={500}>
                    Search Results for "{searchKeyword}"
                  </Text>
                  <Text size="sm" c="dimmed">
                    Found {searchResults.length} restaurants
                  </Text>
                </div>
                <Badge variant="light" color="blue">
                  {searchResults.length} results
                </Badge>
              </Flex>
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {searchResults.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.place_id}
                  restaurant={restaurant}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}

        {showSetup && (
          <Paper withBorder p="xl" radius="md" className={classes.setupCard}>
            <Stack gap="lg" align="center">
              {isGroupMode && (
                <div className={classes.groupSelection}>
                  <Text size="lg" fw={500} mb="md" ta="center">
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
                leftSection={<IconSparkles size={20} />}
              >
                {isLoading ? 'Finding restaurants...' : `Find ${isGroupMode ? 'Group' : 'My'} Restaurants`}
              </Button>

            </Stack>
          </Paper>
        )}

        {showRecommendations && (
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
                      {data.filterCriteria && (
                        <Badge variant="light" color="orange" size="xs">
                          {data.filterCriteria.eligibleCuisines?.length || 0} cuisines: {data.filterCriteria.eligibleCuisines?.join(', ')}
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