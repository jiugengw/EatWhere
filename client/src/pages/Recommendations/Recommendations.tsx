import { useState } from 'react';
import {
    Container,
    SimpleGrid,
    Button,
    Group,
    Text,
    Badge,
    Paper,
    ActionIcon,
    Skeleton,
    Alert,
    Stack
} from '@mantine/core';
import { IconRefresh, IconInfoCircle } from '@tabler/icons-react';
import { CuisineCard } from '@/components/CuisineCard/CuisineCard';
import { useRecommendations } from '@/hooks/recommendations/useRecommendations';
import classes from './recommendations.module.css';
import { useToggleFavourite } from '@/hooks/recommendations/useToggleFavourite';
import { useFavourites } from '@/hooks/recommendations/useFavourites';
import { useDiscoverRecommendations } from '@/hooks/recommendations/useDiscoverRecommendations';
import { Link } from '@tanstack/react-router';

export function RecommendationsPage() {
    const [mode, setMode] = useState<'top' | 'discover'>('top');
    const [switching, setSwitching] = useState(false);

    const handleModeChange = (newMode: 'top' | 'discover') => {
        setSwitching(true);
        setMode(newMode);
        setTimeout(() => setSwitching(false), 100);
    };

    const { data, isLoading, error, refetch } = mode === 'top'
        ? useRecommendations(4)
        : useDiscoverRecommendations(4);

    const { data: favouritesData } = useFavourites();
    const { mutate: toggleFavourite } = useToggleFavourite();

    const favourites = favouritesData?.data?.favourites || [];

    const handleShowDetails = (cuisineName: string) => {
        console.log('Show details for:', cuisineName);
    };

    const handleLikeCuisine = (cuisineName: string) => {
        toggleFavourite(cuisineName);
    };

    const getRecommendationAccuracyExplanation = (totalRatings: number) => {
        if (totalRatings < 5) {
            return {
                level: 'low',
                reason: `you haven't rated enough food experiences yet (${totalRatings} ratings). Try rating more cuisines to improve accuracy!`,
                action: 'Start rating your dining experiences',
                color: 'orange'
            };
        } else if (totalRatings < 25) {
            return {
                level: 'medium',
                reason: `you have some rating history (${totalRatings} ratings) but we're still learning your preferences.`,
                action: 'Keep rating to improve recommendations',
                color: 'blue'
            };
        } else {
            return {
                level: 'high',
                reason: `you have extensive rating history (${totalRatings} ratings) and we understand your preferences well.`,
                action: 'Your recommendations are highly personalized',
                color: 'green'
            };
        }
    };

    if (error) {
        return (
            <Container my="md">
                <Alert icon={<IconInfoCircle size={16} />} title="Error" color="red">
                    Failed to load recommendations. Please try again.
                </Alert>
            </Container>
        );
    }

    const recommendations = data?.data?.recommendations || [];
    const userInfo = data?.data;
    const accuracyInfo = userInfo ? getRecommendationAccuracyExplanation(userInfo.totalRatings) : null;

    const renderSkeletonGrid = () => {
        return (
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 2, lg: 4 }}
                spacing="md"
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} height={300} radius="md" animate />
                ))}
            </SimpleGrid>
        );
    };

    const renderCuisineGrid = () => {
        if (recommendations.length === 0) {
            return (
                <Alert icon={<IconInfoCircle size={16} />} title="No recommendations" color="blue">
                    No recommendations available at the moment.
                </Alert>
            );
        }

        const top4 = recommendations.slice(0, 4);

        return (
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 2, lg: 4 }}
                spacing="md"
                className={`${classes.cuisineGrid} ${switching ? classes.switching : ''}`}
            >
                {top4.map((item: any, index: number) => (
                    <CuisineCard
                        key={`${item.cuisineName}-${index}`}
                        cuisineName={item.cuisineName}
                        score={item.score}
                        reasoning={item.reasoning}
                        confidenceLevel={mode === 'top' ? item.confidenceLevel : undefined}
                        discoveryLevel={mode === 'discover' ? item.discoveryLevel : undefined}
                        onShowDetails={() => handleShowDetails(item.cuisineName)}
                        onLike={() => handleLikeCuisine(item.cuisineName)}
                        variant="compact"
                        isLiked={favourites.includes(item.cuisineName)}
                        isDiscoverMode={mode === 'discover'}
                    />
                ))}
            </SimpleGrid>
        );
    };

    return (
        <Container my="md" className={classes.container}>
            <Paper withBorder p="lg" radius="md" mb="xl" className={classes.header}>
                <Group justify="space-between" align="center">
                    <div>
                        <Text size="xl" fw={600} mb="xs">
                            {mode === 'top'
                                ? "Your best matches based on preferences and dining history"
                                : "Enhanced scores for exploration and discover new flavors beyond your usual choices!"
                            }
                        </Text>
                        <Group gap="xs" mb="md">
                            {userInfo && (
                                <>
                                    <Badge variant="light" color="blue">
                                        {userInfo.totalRatings} ratings given
                                    </Badge>
                                    <Badge
                                        variant="light"
                                        color={
                                            userInfo.userAdaptationLevel === 'new' ? 'orange' :
                                                userInfo.userAdaptationLevel === 'learning' ? 'blue' : 'green'
                                        }
                                    >
                                        {userInfo.userAdaptationLevel} user
                                    </Badge>
                                </>
                            )}
                        </Group>
                        <Text size="sm" c="dimmed">
                            Your top recommendations based on preferences and dining history
                        </Text>
                    </div>
                    <Group>
                        <Button.Group>
                            <Button
                                variant={mode === 'top' ? 'filled' : 'light'}
                                onClick={() => handleModeChange('top')}
                            >
                                My Top Picks
                            </Button>
                            <Button
                                variant={mode === 'discover' ? 'filled' : 'light'}
                                onClick={() => handleModeChange('discover')}
                            >
                                Discover New
                            </Button>
                        </Button.Group>

                        <ActionIcon
                            variant="light"
                            size="lg"
                            onClick={() => refetch()}
                            disabled={isLoading}
                            title="Refresh recommendations"
                        >
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>

            {mode === 'top' && accuracyInfo && (
                <Paper withBorder p="md" radius="md" mb="xl" style={{ backgroundColor: '#f8f9fa' }}>
                    <Stack gap="sm">
                        <Group gap="xs">
                            <IconInfoCircle size={16} color={accuracyInfo.color} />
                            <Text size="sm" fw={500} c={accuracyInfo.color}>
                                Your recommendation accuracy is {accuracyInfo.level}
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            This is because {accuracyInfo.reason}
                        </Text>
                        <Text size="xs" c="dimmed" fs="italic">
                            Note: Individual cuisines may still show different confidence levels based on how certain we are about that specific cuisine for you.
                        </Text>
                        {accuracyInfo.level !== 'strong' && (
                            <Group gap="md" mt="xs">
                                <Button
                                    component={Link}
                                    to="/preferences"
                                    variant="light"
                                    size="xs"
                                    color={accuracyInfo.color}
                                >
                                    Update Preferences
                                </Button>
                                <Text size="xs" c="dimmed">
                                    Or continue rating dining experiences to improve recommendations
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Paper>
            )}

            {isLoading ? renderSkeletonGrid() : renderCuisineGrid()}

            {recommendations.length > 0 && (
                <Paper withBorder p="md" radius="md" mt="xl" className={classes.info}>
                    <Text size="sm" c="dimmed" ta="center">
                        Recommendations improve as you rate more food experiences.
                        Try something new and let us know how it was!
                    </Text>
                </Paper>
            )}
        </Container>
    );
}