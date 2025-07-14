// client/src/components/RestaurantCard/RestaurantCard.tsx
import React from 'react';
import { Card, Text, Badge, Group, Button, Stack, Flex, Image, Skeleton } from '@mantine/core';
import { IconStar, IconMapPin } from '@tabler/icons-react';
import { type RestaurantResult } from '@/hooks/recommendations/useCuisineRecommendation';
import { useRestaurantPhoto } from '@/hooks/recommendations/useRestaurantPhoto';

interface RestaurantCardProps {
  restaurant: RestaurantResult;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const getPriceLevel = (level?: number) => {
    if (!level) return 'Price not available';
    return '$'.repeat(level);
  };

  const handleViewOnMap = () => {
    const lat = restaurant.geometry.location.lat;
    const lng = restaurant.geometry.location.lng;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${restaurant.place_id}`, 
      '_blank'
    );
  };

  // Get the first photo reference if available
  const photoReference = restaurant.photos?.[0]?.photo_reference;
  
  // Use the photo hook
  const { photoUrl, loading: photoLoading, error: photoError, hasPhoto } = useRestaurantPhoto({
    photoReference,
    maxWidth: 400,
    maxHeight: 200
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {/* Restaurant Photo */}
        {hasPhoto ? (
          <>
            {photoLoading ? (
              <Skeleton height={200} />
            ) : photoError ? (
              <div style={{ 
                height: 200, 
                backgroundColor: 'var(--mantine-color-gray-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text c="dimmed" size="sm">Photo unavailable</Text>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <Image
                  src={photoUrl}
                  height={200}
                  alt={restaurant.name}
                  fallbackSrc="/placeholder-restaurant.jpg"
                />
                {/* Open/Closed Badge Overlay */}
                {restaurant.opening_hours?.open_now !== undefined && (
                  <Badge 
                    color={restaurant.opening_hours.open_now ? 'green' : 'red'}
                    variant="filled"
                    size="sm"
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  >
                    {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                  </Badge>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ 
            height: 200, 
            backgroundColor: 'var(--mantine-color-gray-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text c="dimmed" size="sm">No photo available</Text>
          </div>
        )}
      </Card.Section>

      <Stack gap="md" mt="md">
        {/* Restaurant Name and Rating */}
        <Flex justify="space-between" align="flex-start">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={600} size="lg" lineClamp={2}>
              {restaurant.name}
            </Text>
            {/* Show open/closed badge only if no photo (since it's on photo when available) */}
            {!hasPhoto && restaurant.opening_hours?.open_now !== undefined && (
              <Badge 
                color={restaurant.opening_hours.open_now ? 'green' : 'red'}
                variant="light"
                size="sm"
              >
                {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
              </Badge>
            )}
          </Stack>
          
          {restaurant.rating && (
            <Group gap="xs">
              <IconStar size={16} color="#ffd43b" fill="#ffd43b" />
              <Text fw={500} size="sm">
                {restaurant.rating.toFixed(1)}
              </Text>
            </Group>
          )}
        </Flex>

        {/* Address */}
        <Text size="sm" c="dimmed">
          {restaurant.vicinity || 'Location not available'}
        </Text>

        {/* Price and Action */}
        <Flex justify="space-between" align="center">
          <div>
            {restaurant.price_level && (
              <Text size="sm" fw={500} c="green">
                {getPriceLevel(restaurant.price_level)}
              </Text>
            )}
          </div>
          
          <Button
            size="sm"
            leftSection={<IconMapPin size={16} />}
            onClick={handleViewOnMap}
          >
            View on Map
          </Button>
        </Flex>

        {/* Cuisine Tags */}
        <Group gap="xs">
          {restaurant.types.slice(0, 3).map((type) => (
            <Badge 
              key={type}
              variant="outline" 
              color="gray"
              size="xs"
            >
              {type.replace(/_/g, ' ')}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
};