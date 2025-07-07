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
    Alert
} from '@mantine/core';
import { IconRefresh, IconInfoCircle } from '@tabler/icons-react';
import { CuisineCard } from '@/components/CuisineCard/CuisineCard';
import { useRecommendations } from '@/hooks/recommendations/useRecommendations';
import classes from './recommendations.module.css';
import { useToggleFavourite } from '@/hooks/recommendations/useToggleFavourite';
import { useFavourites } from '@/hooks/recommendations/useFavourites';
import { useDiscoverRecommendations } from '@/hooks/recommendations/useDiscoverRecommendations';

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
                        confidenceLevel={item.confidenceLevel}
                        onShowDetails={() => handleShowDetails(item.cuisineName)}
                        onLike={() => handleLikeCuisine(item.cuisineName)}
                        variant="compact"
                        isLiked={favourites.includes(item.cuisineName)}
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
                                : "Enhanced scores for exploration - discover new flavors beyond your usual choices"
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