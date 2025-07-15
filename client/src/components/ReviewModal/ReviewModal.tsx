// client/src/components/RestaurantCard/RestaurantRatingModal.tsx
import React, { useState } from 'react';
import { Modal, Select, Rating, Textarea, Title, Stack, Text, Group, Button } from '@mantine/core';
import { type AIRestaurantResult } from '@/types/restaurant';
import { useSubmitRating } from '@/hooks/recommendations/useSubmitRating';
import { showNotification } from '@mantine/notifications';
import classes from './RestaurantCard.module.css';

interface ReviewModalProps {
  opened: boolean;
  onClose: () => void;
  restaurant: AIRestaurantResult;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  opened,
  onClose,
  restaurant
}) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const { mutate: submitRating, isPending } = useSubmitRating();

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
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setUserRating(0);
    setReviewText('');
    setSelectedCuisine(null);
    onClose();
  };

  const cuisineOptions = [
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
  ];

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 0: return 'Select a rating';
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      title={
        <Title order={3} className={classes.modalTitle}>
          How was your meal at {restaurant.name}?
        </Title>
      }
      centered
      size="md"
    >
      <div className={classes.modalContent}>
        <Stack gap="lg">
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
              data={cuisineOptions}
              required
              searchable
              clearable
              className={classes.cuisineSelect}
            />
          </div>

          {/* Rating Section */}
          <div className={classes.ratingSection}>
            <Text size="sm" fw={500} mb="xs">Rating *</Text>
            <Rating
              value={userRating}
              onChange={setUserRating}
              size="lg"
              className={classes.ratingInput}
            />
            <Text size="xs" c="dimmed" mt="xs">
              {getRatingLabel(userRating)}
            </Text>
          </div>

          {/* Review Text */}
          <Textarea
            label="Review (optional)"
            placeholder="Tell us about your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.currentTarget.value)}
            minRows={3}
            maxRows={5}
            className={classes.reviewTextarea}
          />

          {/* Action Buttons */}
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
      </div>
    </Modal>
  );
};