// client/src/pages/Search/SearchRestaurants.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  TextInput,
  SimpleGrid,
  Button,
  Group,
  Select,
  Stack,
  Paper,
  Text,
  Loader,
  Alert,
  ActionIcon,
  Flex,
  Badge,
  RangeSlider,
  Checkbox,
  Collapse,
  Divider,
  Center,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconMapPin,
  IconAdjustments,
  IconRefresh,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { useLocation as useRouterLocation, useNavigate } from '@tanstack/react-router';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';
import { useLocation } from '@/hooks/useLocation';
import { RestaurantCard } from '@/components/RestaurantCard/RestaurantCard';
import { LocationRequester } from '@/components/LocationRequester/LocationRequester';
import classes from './SearchRestaurants.module.css';
import type { AIRestaurantResult } from '@/types/restaurant';

interface SearchFilters {
  keyword: string;
  radius: number;
  minRating: number;
  maxPriceLevel: number;
  openNow: boolean;
  sortBy: 'relevance' | 'rating' | 'distance';
}

const RADIUS_OPTIONS = [
  { value: '500', label: '500m' },
  { value: '1000', label: '1km' },
  { value: '2000', label: '2km' },
  { value: '5000', label: '5km' },
  { value: '10000', label: '10km' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest First' },
];

export const SearchRestaurantsPage: React.FC = () => {
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  
  // Get initial search from URL params
  const searchParams = new URLSearchParams(routerLocation.search);
  const initialKeyword = searchParams.get('q') || '';

  // State management
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: initialKeyword,
    radius: 2000,
    minRating: 0,
    maxPriceLevel: 4,
    openNow: false,
    sortBy: 'relevance'
  });
  
  const [restaurants, setRestaurants] = useState<AIRestaurantResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced search
  const [debouncedKeyword] = useDebouncedValue(filters.keyword, 500);

  // Location hook
  const { 
    location, 
    loading: locationLoading, 
    error: locationError,
    getCurrentLocation 
  } = useLocation();

  // Auto-search when debounced keyword changes (but not on initial load)
  useEffect(() => {
    if (debouncedKeyword && debouncedKeyword !== initialKeyword && hasSearched) {
      handleSearch();
    }
  }, [debouncedKeyword]);

  // Search function
  const handleSearch = async (newFilters?: Partial<SearchFilters>) => {
    if (!location) {
      setError('Location is required for search. Please enable location services.');
      return;
    }

    const searchFilters = { ...filters, ...newFilters };
    
    if (!searchFilters.keyword.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const queryParams = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        keyword: searchFilters.keyword.trim(),
        radius: searchFilters.radius.toString(),
        type: 'restaurant'
      });

      const response = await axiosPrivate.get(`/google/places?${queryParams}`);
      
      let results = response.data.data?.results || response.data.results || [];
      
      // Apply client-side filters
      results = applyFilters(results, searchFilters);
      
      setRestaurants(results);
      setTotalResults(results.length);

      // Update URL with search term
      if (searchFilters.keyword) {
        navigate({
          to: '/search',
          search: { q: searchFilters.keyword },
          replace: true
        });
      }

    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search restaurants');
      setRestaurants([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters and sorting
  const applyFilters = (results: AIRestaurantResult[], searchFilters: SearchFilters) => {
    let filtered = results.filter(restaurant => {
      // Rating filter
      if (searchFilters.minRating > 0 && (!restaurant.rating || restaurant.rating < searchFilters.minRating)) {
        return false;
      }

      // Price level filter
      if (restaurant.price_level && restaurant.price_level > searchFilters.maxPriceLevel) {
        return false;
      }

      // Open now filter
      if (searchFilters.openNow && (!restaurant.opening_hours?.open_now)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    switch (searchFilters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        if (location) {
          filtered.sort((a, b) => {
            const distA = calculateDistance(
              location.lat, location.lng,
              a.geometry.location.lat, a.geometry.location.lng
            );
            const distB = calculateDistance(
              location.lat, location.lng,
              b.geometry.location.lat, b.geometry.location.lng
            );
            return distA - distB;
          });
        }
        break;
      // 'relevance' is the default order from Google
    }

    return filtered;
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle filter changes
  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Auto-search if we have results and it's not the keyword (keyword is debounced)
    if (hasSearched && key !== 'keyword') {
      const filteredResults = applyFilters(restaurants, newFilters);
      setRestaurants(filteredResults);
    }
  };

  // Quick search suggestions
  const quickSearches = [
    'Chinese restaurant',
    'Pizza',
    'Sushi',
    'Coffee shop',
    'Fast food',
    'Fine dining',
    'Vegetarian',
    'Breakfast'
  ];

  const getPriceText = (level: number) => {
    const labels = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    return labels[level] || 'Unknown';
  };

  // Loading state for initial location
  if (locationLoading && !location) {
    return (
      <Container size="sm" className={classes.container}>
        <Center style={{ minHeight: '60vh' }}>
          <Stack align="center" gap="lg">
            <Loader size="lg" />
            <Text ta="center" c="dimmed">Getting your location...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" className={classes.container}>
      <Stack gap="xl">
        {/* Header */}
        <div className={classes.header}>
          <Title order={1} className={classes.title}>
            Search Restaurants
          </Title>
          <Text c="dimmed" size="lg">
            Find the perfect place to dine near you
          </Text>
        </div>

        {/* Location Section */}
        <Paper withBorder p="lg" radius="md" className={classes.locationSection}>
          <Group gap="sm" mb="md">
            <IconMapPin size={20} />
            <Text fw={500}>Search Location</Text>
          </Group>
          <LocationRequester
            variant="card"
            showCoordinates={true}
          />
          {locationError && (
            <Alert 
              icon={<IconInfoCircle size={16} />} 
              color="orange" 
              mt="md"
            >
              {locationError}
            </Alert>
          )}
        </Paper>

        {/* Search Section */}
        <Paper withBorder p="lg" radius="md" className={classes.searchSection}>
          <Stack gap="md">
            <Group align="flex-end">
              <TextInput
                placeholder="Search for restaurants, cuisines, or dishes..."
                size="lg"
                leftSection={<IconSearch size={20} />}
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className={classes.searchInput}
                style={{ flex: 1 }}
              />
              
              <Button
                size="lg"
                onClick={() => handleSearch()}
                loading={loading}
                disabled={!location || !filters.keyword.trim()}
                className={classes.searchButton}
              >
                Search
              </Button>
              
              <ActionIcon
                size="lg"
                variant="light"
                onClick={() => setShowFilters(!showFilters)}
                className={classes.filterToggle}
              >
                <IconFilter size={20} />
              </ActionIcon>
            </Group>

            {/* Quick Search Suggestions */}
            {!hasSearched && (
              <div>
                <Text size="sm" c="dimmed" mb="xs">Quick searches:</Text>
                <Group gap="xs">
                  {quickSearches.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="light"
                      size="xs"
                      onClick={() => {
                        updateFilter('keyword', suggestion);
                        handleSearch({ keyword: suggestion });
                      }}
                      className={classes.quickSearchButton}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </Group>
              </div>
            )}

            {/* Advanced Filters */}
            <Collapse in={showFilters}>
              <Divider mb="md" />
              <div className={classes.filtersGrid}>
                <Stack gap="md">
                  <Text fw={500} size="sm">
                    <IconAdjustments size={16} style={{ marginRight: 8 }} />
                    Filters
                  </Text>

                  <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                    <Select
                      label="Search Radius"
                      value={filters.radius.toString()}
                      onChange={(value) => updateFilter('radius', parseInt(value || '2000'))}
                      data={RADIUS_OPTIONS}
                      size="sm"
                    />

                    <Select
                      label="Sort By"
                      value={filters.sortBy}
                      onChange={(value) => updateFilter('sortBy', value as SearchFilters['sortBy'])}
                      data={SORT_OPTIONS}
                      size="sm"
                    />

                    <div>
                      <Text size="sm" fw={500} mb="xs">
                        Min Rating: {filters.minRating || 'Any'}
                      </Text>
                      <RangeSlider
                        value={[filters.minRating, 5]}
                        onChange={([min]) => updateFilter('minRating', min)}
                        min={0}
                        max={5}
                        step={0.5}
                        marks={[
                          { value: 0, label: 'Any' },
                          { value: 3, label: '3+' },
                          { value: 4, label: '4+' },
                          { value: 5, label: '5' }
                        ]}
                        size="sm"
                      />
                    </div>

                    <div>
                      <Text size="sm" fw={500} mb="xs">
                        Max Price: {getPriceText(filters.maxPriceLevel)}
                      </Text>
                      <RangeSlider
                        value={[0, filters.maxPriceLevel]}
                        onChange={([, max]) => updateFilter('maxPriceLevel', max)}
                        min={0}
                        max={4}
                        step={1}
                        marks={[
                          { value: 0, label: 'Free' },
                          { value: 1, label: '$' },
                          { value: 2, label: '$$' },
                          { value: 3, label: '$$$' },
                          { value: 4, label: '$$$$' }
                        ]}
                        size="sm"
                      />
                    </div>
                  </SimpleGrid>

                  <Group>
                    <Checkbox
                      label="Open now only"
                      checked={filters.openNow}
                      onChange={(e) => updateFilter('openNow', e.currentTarget.checked)}
                      size="sm"
                    />
                  </Group>
                </Stack>
              </div>
            </Collapse>
          </Stack>
        </Paper>

        {/* Results Section */}
        {hasSearched && (
          <div className={classes.resultsSection}>
            {/* Results Header */}
            <Flex justify="space-between" align="center" mb="lg">
              <div>
                <Text size="lg" fw={500}>
                  Search Results
                </Text>
                <Text size="sm" c="dimmed">
                  {loading ? 'Searching...' : `Found ${totalResults} restaurants`}
                  {filters.keyword && ` for "${filters.keyword}"`}
                </Text>
              </div>
              
              <Group>
                {totalResults > 0 && (
                  <Badge variant="light" size="lg">
                    {totalResults} results
                  </Badge>
                )}
                <ActionIcon
                  variant="light"
                  onClick={() => handleSearch()}
                  loading={loading}
                  title="Refresh results"
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Group>
            </Flex>

            {/* Error State */}
            {error && (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                title="Search Error" 
                color="red"
                mb="lg"
              >
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <Loader size="lg" />
                  <Text c="dimmed">Searching restaurants...</Text>
                </Stack>
              </Center>
            )}

            {/* No Results */}
            {!loading && !error && restaurants.length === 0 && hasSearched && (
              <Paper withBorder p="xl" radius="md" className={classes.emptyState}>
                <Stack align="center" gap="lg">
                  <IconSearch size={48} color="var(--mantine-color-gray-5)" />
                  <div style={{ textAlign: 'center' }}>
                    <Text size="lg" fw={500} mb="xs">
                      No restaurants found
                    </Text>
                    <Text c="dimmed" mb="md">
                      Try adjusting your search terms or filters
                    </Text>
                    <Group justify="center">
                      <Button variant="light" onClick={() => setShowFilters(true)}>
                        Adjust Filters
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => updateFilter('keyword', '')}
                      >
                        Clear Search
                      </Button>
                    </Group>
                  </div>
                </Stack>
              </Paper>
            )}

            {/* Results Grid */}
            {!loading && restaurants.length > 0 && (
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing="lg"
                className={classes.resultsGrid}
              >
                {restaurants.map((restaurant) => (
                  <RestaurantCard 
                    key={restaurant.place_id}
                    restaurant={restaurant}
                  />
                ))}
              </SimpleGrid>
            )}
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <Paper withBorder p="xl" radius="md" className={classes.welcomeState}>
            <Stack align="center" gap="lg">
              <IconSearch size={48} color="var(--mantine-color-blue-5)" />
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={600} mb="xs">
                  Discover Great Restaurants
                </Text>
                <Text c="dimmed" size="lg" mb="lg">
                  Search for restaurants, cuisines, or specific dishes near your location
                </Text>
                <Group justify="center">
                  <Button 
                    size="md"
                    onClick={getCurrentLocation}
                    loading={locationLoading}
                    disabled={!!location}
                    leftSection={<IconMapPin size={18} />}
                  >
                    {location ? 'Location Ready' : 'Enable Location'}
                  </Button>
                </Group>
              </div>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};