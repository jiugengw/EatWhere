// client/src/components/RestaurantCard/RestaurantCard.tsx
import React, { useState } from 'react';
import { Card, Text, Badge, Group, Button, Stack, Image, Skeleton } from '@mantine/core';
import { IconStar, IconMapPin, IconChefHat } from '@tabler/icons-react';
import { type AIRestaurantResult } from '@/types/restaurant';
import { useRestaurantPhoto } from '@/hooks/recommendations/useRestaurantPhoto';
import { ReviewModal } from '../ReviewModal/ReviewModal';
import classes from './RestaurantCard.module.css';

interface RestaurantCardProps {
  restaurant: AIRestaurantResult;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

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

  const handleEatingHere = () => {
    setRatingModalOpen(true);
  };

  const handleCloseModal = () => {
    setRatingModalOpen(false);
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
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
        <Card.Section className={classes.imageSection}>
          {/* Restaurant Photo */}
          {hasPhoto ? (
            <>
              {photoLoading ? (
                <Skeleton height={200} className={classes.imageSkeleton} />
              ) : photoError ? (
                <div className={classes.noImage}>
                  <Text c="dimmed" size="sm">Photo unavailable</Text>
                </div>
              ) : (
                <div className={classes.imageContainer}>
                  <Image
                    src={photoUrl}
                    height={200}
                    alt={restaurant.name}
                    fallbackSrc="/placeholder-restaurant.jpg"
                    className={classes.restaurantImage}
                  />
                  {/* Open/Closed Badge Overlay */}
                  {restaurant.opening_hours?.open_now !== undefined && (
                    <Badge
                      color={restaurant.opening_hours.open_now ? 'green' : 'red'}
                      variant="filled"
                      size="sm"
                      className={classes.statusBadge}
                    >
                      {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </Badge>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={classes.noImage}>
              <Text c="dimmed" size="sm">No photo available</Text>
              {/* Show open/closed badge when no photo */}
              {restaurant.opening_hours?.open_now !== undefined && (
                <Badge
                  color={restaurant.opening_hours.open_now ? 'green' : 'red'}
                  variant="light"
                  size="sm"
                  className={classes.statusBadgeNoPhoto}
                >
                  {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                </Badge>
              )}
            </div>
          )}
        </Card.Section>

        <div className={classes.cardContent}>
          <Stack gap="md" mt="md">
            {/* Restaurant Name and Rating */}
            <div className={classes.restaurantHeader}>
              <Stack gap="xs" style={{ flex: 1 }}>
                <Text fw={600} size="lg" lineClamp={2} className={classes.restaurantName}>
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
                <Group gap="xs" className={classes.ratingGroup}>
                  <IconStar size={16} className={classes.starIcon} />
                  <Text fw={500} size="sm" className={classes.ratingText}>
                    {restaurant.rating.toFixed(1)}
                  </Text>
                </Group>
              )}
            </div>

            {/* Address */}
            <Text size="sm" c="dimmed" className={classes.address}>
              {restaurant.vicinity || 'Location not available'}
            </Text>

            {/* Price */}
            <div className={classes.priceSection}>
              {restaurant.price_level && (
                <Text size="sm" fw={500} className={classes.priceText}>
                  {getPriceLevel(restaurant.price_level)}
                </Text>
              )}
            </div>

            {/* Cuisine Tags */}
            <Group gap="xs" className={classes.cuisineTags}>
              {restaurant.types.slice(0, 3).map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  color="gray"
                  size="xs"
                  className={classes.cuisineBadge}
                >
                  {type.replace(/_/g, ' ')}
                </Badge>
              ))}
            </Group>

            {/* Action Buttons */}
            <Group justify="space-between" mt="auto" className={classes.actionButtons}>
              <Button
                size="sm"
                leftSection={<IconChefHat size={16} />}
                onClick={handleEatingHere}
                className={classes.eatingButton}
              >
                I'm Eating Here!
              </Button>

              <Button
                size="sm"
                leftSection={<IconMapPin size={16} />}
                onClick={handleViewOnMap}
                variant="outline"
                className={classes.mapButton}
              >
                View Map
              </Button>
            </Group>
          </Stack>
        </div>
      </Card>

      {/* Rating Modal */}
      <ReviewModal
        opened={ratingModalOpen}
        onClose={handleCloseModal}
        restaurant={restaurant}
      />
    </>
  );
};