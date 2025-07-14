import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  Button, 
  Stack, 
  Flex, 
  Image, 
  Skeleton,
  Modal,
  Title,
  Rating,
  Textarea,
  Select
} from '@mantine/core';
import { IconStar, IconMapPin, IconChefHat } from '@tabler/icons-react';
import { type RestaurantResult } from '@/hooks/recommendations/useCuisineRecommendations';
import { useRestaurantPhoto } from '@/hooks/recommendations/useRestaurantPhoto';
import { useSubmitRating } from '@/hooks/recommendations/useSubmitRating';
import { showNotification } from '@mantine/notifications';
import classes from './RestaurantCard.module.css';

interface RestaurantCardProps {
  restaurant: RestaurantResult;
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

    submitRating({ 
      cuisineName: selectedCuisine,
      rating: userRating 
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
            </div>
          )}
        </Card.Section>

        <Stack gap="md" mt="md" className={classes.cardContent}>
          {/* Restaurant Header */}
          <div className={classes.restaurantHeader}>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text fw={600} size="lg" lineClamp={2} className={classes.restaurantName}>
                {restaurant.name}
              </Text>
              
              {/* Show open/closed badge only if no photo */}
              {!hasPhoto && restaurant.opening_hours?.open_now !== undefined && (
                <Badge 
                  color={restaurant.opening_hours.open_now ? 'green' : 'red'}
                  variant="light"
                  size="sm"
                  className={classes.statusBadgeNoPhoto}
                >
                  {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                </Badge>
              )}
            </Stack>
            
            {/* Rating */}
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

          {/* Price and Cuisine Tags */}
          <Flex justify="space-between" align="center" className={classes.priceSection}>
            <div>
              {restaurant.price_level && (
                <Text size="sm" fw={500} className={classes.priceText}>
                  {getPriceLevel(restaurant.price_level)}
                </Text>
              )}
            </div>
          </Flex>

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
      </Card>

      {/* Rating Modal */}
      <Modal
        opened={ratingModalOpen}
        onClose={handleCloseModal}
        title={
          <Title order={3} className={classes.modalTitle}>
            How was your meal at {restaurant.name}?
          </Title>
        }
        centered
        size="md"
        className={classes.ratingModal}
      >
        <Stack gap="lg" className={classes.modalContent}>
          <Text size="sm" c="dimmed" className={classes.modalDescription}>
            Rate your dining experience to get better recommendations in the future
          </Text>
          
          {/* Cuisine Selection */}
          <div className={classes.cuisineSection}>
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
              className={classes.cuisineSelect}
              searchable
              clearable
            />
          </div>
          
          <div className={classes.ratingSection}>
            <Text size="sm" fw={500} mb="xs">Rating *</Text>
            <Rating
              value={userRating}
              onChange={setUserRating}
              size="lg"
              className={classes.ratingInput}
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
            className={classes.reviewTextarea}
          />
          
          <Group justify="flex-end" className={classes.modalActions}>
            <Button
              variant="light"
              onClick={handleCloseModal}
              className={classes.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={userRating === 0 || !selectedCuisine}
              loading={isPending}
              className={classes.submitButton}
            >
              Submit Rating
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};