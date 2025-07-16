// client/src/components/RestaurantCard/RestaurantCard.tsx
import React, { useState } from 'react';
import { Card, Text, Badge, Group, Button, Stack, Flex, Image, Skeleton, Modal, Select, Rating, Textarea, Title } from '@mantine/core';
import { IconStar, IconMapPin, IconChefHat } from '@tabler/icons-react';
import { type AIRestaurantResult } from '@/types/restaurant';
import { useRestaurantPhoto } from '@/hooks/recommendations/useRestaurantPhoto';
import { useSubmitRating } from '@/hooks/recommendations/useSubmitRating';
import { showNotification } from '@mantine/notifications';

interface RestaurantCardProps {
  restaurant: AIRestaurantResult;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const { mutate: submitRating, isPending } = useSubmitRating();
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

  const handleSubmitRating = () => {
    if (userRating === 0) {
      showNotification({
        title: 'Rating Required',
        message: 'Please select a rating before submitting',
        color: 'orange'
      });
      return;
    }

    if (!selectedCuisine) {
      showNotification({
        title: 'Cuisine Required',
        message: 'Please select the cuisine type',
        color: 'orange'
      });
      return;
    }

    const restaurantId = restaurant.place_id;
    const googleRating = restaurant.rating ?? 0;

    submitRating({
      restaurantId,
      cuisineName: selectedCuisine,
      rating: userRating,
      googleRating,
    });

    // Reset modal state
    setRatingModalOpen(false);
    setUserRating(0);
    setReviewText('');
    setSelectedCuisine(null);
  };

  const handleCloseModal = () => {
    setRatingModalOpen(false);
    setUserRating(0);
    setReviewText('');
    setSelectedCuisine(null);
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

          <Group justify="space-between" mt="auto">
            <Button
              size="sm"
              leftSection={<IconChefHat size={16} />}
              onClick={handleEatingHere}
            >
              I'm Eating Here!
            </Button>

            <Button
              size="sm"
              leftSection={<IconMapPin size={16} />}
              onClick={handleViewOnMap}
              variant="outline"
            >
              View On Map
            </Button>
          </Group>
        </Stack>
      </Card>
      <Modal
        opened={ratingModalOpen}
        onClose={handleCloseModal}
        title={
          <Title order={3}>
            How was your meal at {restaurant.name}?
          </Title>
        }
        centered
        size="md"
      >
        <Stack gap="lg">
          <Text size="sm" c="dimmed">
            Rate your dining experience to get better recommendations in the future
          </Text>

          {/* Cuisine Selection */}
          <div>
            <Text size="sm" fw={500} mb="xs">What type of cuisine was this? *</Text>
            <Select
              placeholder="Select cuisine type"
              value={selectedCuisine}
              onChange={setSelectedCuisine}
              data={[
                { value: 'Chinese', label: 'Chinese' },
                { value: 'Japanese', label: 'Japanese' },
                { value: 'Korean', label: 'Korean' },
                { value: 'Italian', label: 'Italian' },
                { value: 'Mexican', label: 'Mexican' },
                { value: 'Indian', label: 'Indian' },
                { value: 'Thai', label: 'Thai' },
                { value: 'French', label: 'French' },
                { value: 'Muslim', label: 'Middle Eastern/Halal' },
                { value: 'Vietnamese', label: 'Vietnamese' },
                { value: 'Western', label: 'Western' },
                { value: 'Fast Food', label: 'Fast Food' },
              ]}
              required
              searchable
              clearable
            />
          </div>

          <div>
            <Text size="sm" fw={500} mb="xs">Rating *</Text>
            <Rating
              value={userRating}
              onChange={setUserRating}
              size="lg"
            />
            <Text size="xs" c="dimmed" mt="xs">
              {userRating === 0 && 'Select a rating'}
              {userRating === 1 && 'Poor'}
              {userRating === 2 && 'Fair'}
              {userRating === 3 && 'Good'}
              {userRating === 4 && 'Very Good'}
              {userRating === 5 && 'Excellent'}
            </Text>
          </div>

          <Textarea
            label="Review (optional)"
            placeholder="Tell us about your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.currentTarget.value)}
            minRows={3}
            maxRows={5}
          />

          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={userRating === 0 || !selectedCuisine}
              loading={isPending}
            >
              Submit Rating
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};