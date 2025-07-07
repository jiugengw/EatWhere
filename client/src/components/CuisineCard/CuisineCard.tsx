import { IconHeart, IconStar } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Stack, Text } from '@mantine/core';
import classes from './CuisineCard.module.css';

interface CuisineCardProps {
  cuisineName: string;
  score: number;
  reasoning: string;
  confidenceLevel: number;
  onShowDetails: () => void;
  onLike?: () => void;
  variant?: 'full' | 'compact' | 'mini';
  isLiked?: boolean;
}

const getCuisineImage = (cuisine: string): string => {
  const images: { [key: string]: string } = {
    Chinese: '/images/cuisines/chinese.jpg',
    Korean: '/images/cuisines/korean.jpg',
    Japanese: '/images/cuisines/japanese.jpg',
    Italian: '/images/cuisines/italian.jpg',
    Mexican: '/images/cuisines/mexican.jpg',
    Indian: '/images/cuisines/indian.jpg',
    Thai: '/images/cuisines/thai.jpg',
    French: '/images/cuisines/french.jpg',
    Muslim: '/images/cuisines/muslim.jpg',
    Vietnamese: '/images/cuisines/vietnamese.jpg',
    Western: '/images/cuisines/western.jpg',
    'Fast Food': '/images/cuisines/fastfood.jpg'
  };

  return images[cuisine] || '/images/cuisines/chinese.jpg';
};

const getCuisineFeatures = (cuisine: string) => {
  const features: { [key: string]: Array<{ emoji: string; label: string }> } = {
    Chinese: [
      { emoji: '🌶️', label: 'Spicy' },
      { emoji: '🥟', label: 'Dumplings' },
      { emoji: '🍜', label: 'Noodles' },
      { emoji: '🍚', label: 'Rice dishes' }
    ],
    Korean: [
      { emoji: '🌶️', label: 'Spicy' },
      { emoji: '🥬', label: 'Fermented' },
      { emoji: '🍖', label: 'BBQ' },
      { emoji: '🍚', label: 'Rice dishes' }
    ],
    Japanese: [
      { emoji: '🍣', label: 'Sushi' },
      { emoji: '🍜', label: 'Ramen' },
      { emoji: '🐟', label: 'Fresh fish' },
      { emoji: '🍵', label: 'Tea' }
    ],
    Italian: [
      { emoji: '🍝', label: 'Pasta' },
      { emoji: '🍕', label: 'Pizza' },
      { emoji: '🧀', label: 'Cheese' },
      { emoji: '🍷', label: 'Wine' }
    ],
    Mexican: [
      { emoji: '🌮', label: 'Tacos' },
      { emoji: '🌶️', label: 'Spicy' },
      { emoji: '🥑', label: 'Avocado' },
      { emoji: '🌽', label: 'Corn-based' }
    ],
    Indian: [
      { emoji: '🌶️', label: 'Spicy' },
      { emoji: '🍛', label: 'Curry' },
      { emoji: '🫓', label: 'Bread' },
      { emoji: '🌿', label: 'Aromatic spices' }
    ],
    Thai: [
      { emoji: '🌶️', label: 'Spicy' },
      { emoji: '🥥', label: 'Coconut' },
      { emoji: '🍜', label: 'Noodles' },
      { emoji: '🌿', label: 'Fresh herbs' }
    ],
    French: [
      { emoji: '🥖', label: 'Bread' },
      { emoji: '🍷', label: 'Wine' },
      { emoji: '🧀', label: 'Cheese' },
      { emoji: '👨‍🍳', label: 'Fine dining' }
    ],
    Muslim: [
      { emoji: '🥩', label: 'Halal meat' },
      { emoji: '🌿', label: 'Herbs & spices' },
      { emoji: '🍚', label: 'Rice dishes' },
      { emoji: '🌶️', label: 'Spicy' },
    ],
    Vietnamese: [
      { emoji: '🍜', label: 'Pho' },
      { emoji: '🌿', label: 'Fresh herbs' },
      { emoji: '🥬', label: 'Light & fresh' },
      { emoji: '☕', label: 'Coffee' }
    ],
    Western: [
      { emoji: '🥩', label: 'Steaks' },
      { emoji: '🍔', label: 'Burgers' },
      { emoji: '🥗', label: 'Salads' },
      { emoji: '🍰', label: 'Desserts' }
    ],
    'Fast Food': [
      { emoji: '🍔', label: 'Quick meals' },
      { emoji: '🍟', label: 'Fried sides' },
      { emoji: '🥤', label: 'Drinks' },
      { emoji: '⚡', label: 'Fast service' }
    ]
  };

  return features[cuisine] || [
    { emoji: '🍽️', label: 'Delicious' },
    { emoji: '🌟', label: 'Popular' }
  ];
};

const getScoreColor = (score: number): string => {
  if (score >= 4.5) return 'green';
  if (score >= 4.0) return 'teal';
  if (score >= 3.5) return 'blue';
  if (score >= 3.0) return 'yellow';
  return 'orange';
};

const getConfidenceBadge = (level: number): { color: string; label: string } => {
  if (level >= 0.8) return { color: 'green', label: 'High confidence' };
  if (level >= 0.5) return { color: 'blue', label: 'Medium confidence' };
  return { color: 'orange', label: 'Low confidence' };
};

export function CuisineCard({
  cuisineName,
  score,
  reasoning,
  confidenceLevel,
  onShowDetails,
  onLike,
  isLiked = false
}: CuisineCardProps) {
  const image = getCuisineImage(cuisineName);
  const features = getCuisineFeatures(cuisineName);
  const scoreColor = getScoreColor(score);
  const confidence = getConfidenceBadge(confidenceLevel);

  const featureBadges = features.map((feature) => (
    <Badge variant="light" key={feature.label} leftSection={feature.emoji}>
      {feature.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={cuisineName} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Stack gap={4}>
          <Text fz="lg" fw={500}>
            {cuisineName}
          </Text>
          <Group gap="xs">
            <Badge size="sm" variant="filled" color={scoreColor} leftSection={<IconStar size={12} />}>
              {score.toFixed(1)}
            </Badge>
            <Badge size="sm" variant="light" color={confidence.color}>
              {confidence.label}
            </Badge>
          </Group>
        </Stack>
        <Text fz="sm" mt="xs" c="dimmed">
          {reasoning}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Stack align="flex-start" px="md">
          <Text mt="md" className={classes.label} c="dimmed">
            For those who love
          </Text>
        </Stack>
        <Group gap={7} mt={5}>
          {featureBadges}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} onClick={onShowDetails}>
          Show details
        </Button>
        <ActionIcon
          variant="default"
          radius="md"
          size={36}
          onClick={onLike}
          color={isLiked ? "red" : "gray"}
        >
          <IconHeart
            className={classes.like}
            stroke={1.5}
            fill={isLiked ? "currentColor" : "none"}
          />
        </ActionIcon>
      </Group>
    </Card>
  );
}

