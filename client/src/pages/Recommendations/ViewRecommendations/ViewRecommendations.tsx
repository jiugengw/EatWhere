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
    Stack,
    Select,
    SegmentedControl
} from '@mantine/core';
import { IconRefresh, IconInfoCircle } from '@tabler/icons-react';
import { CuisineCard } from '@/components/CuisineCard/CuisineCard';
import classes from './ViewRecommendations.module.css';
import { useToggleFavourite } from '@/hooks/recommendations/useToggleFavourite';
import { useFavourites } from '@/hooks/recommendations/useFavourites';
import { Link } from '@tanstack/react-router';
import { useViewGroups } from '@/hooks/groups/useViewGroups';
import { useNavigate } from '@tanstack/react-router';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';

export const ViewRecommendationsPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const type = searchParams.get('type') || 'personal';
    const selectedGroupId = searchParams.get('groupId') || '';

    const [switching, setSwitching] = useState(false);
    const navigate = useNavigate();

    const handleModeChange = (newType: 'personal' | 'group') => {
        setSwitching(true);

        navigate({
            to: '/recommendations',
            search: {
                type: newType,
                ...(selectedGroupId && newType === 'group' && { groupId: selectedGroupId })
            }
        });

        setTimeout(() => setSwitching(false), 100);
    };

    const { data: favouritesData } = useFavourites();
    const { mutate: toggleFavourite } = useToggleFavourite();
    const favourites = favouritesData?.data?.favourites || [];

    const { data: groupsData } = useViewGroups();
    const userGroups = groupsData?.data?.user?.groups || [];

    const axiosPrivate = useAxiosPrivate();

    // Single query for recommendations
    const { data: recommendationsData, isLoading, refetch } = useQuery({
        queryKey: ['recommendations', type, selectedGroupId],
        queryFn: async () => {
            let endpoint = '/recommendations?limit=8'; // Get more to ensure variety
            if (type === 'group' && selectedGroupId) {
                endpoint = `/recommendations/group/${selectedGroupId}?limit=8`;
            }
            const res = await axiosPrivate.get(endpoint);
            return res.data;
        },
        enabled: type === 'personal' || (type === 'group' && !!selectedGroupId),
    });

    // Get discover recommendations separately if you want to mix them
    const { data: discoverData, isLoading: isDiscoverLoading, refetch: refetchDiscover } = useQuery({
        queryKey: ['recommendations-discover', type, selectedGroupId],
        queryFn: async () => {
            let endpoint = '/recommendations/discover?limit=4';
            if (type === 'group' && selectedGroupId) {
                endpoint = `/recommendations/group/${selectedGroupId}/discover?limit=4`;
            }
            const res = await axiosPrivate.get(endpoint);
            return res.data;
        },
        enabled: type === 'personal' || (type === 'group' && !!selectedGroupId),
    });

    const handleShowDetails = (cuisineName: string) => {
        navigate({
            to: '/recommendations/cuisine',
            search: {
                cuisine: cuisineName,
                limit: '10' 
            }
        });
    };

    const handleLikeCuisine = (cuisineName: string) => {
        toggleFavourite(cuisineName);
    };

    const refetchAll = () => {
        refetch();
        refetchDiscover();
    };

    const getRecommendationAccuracyExplanation = (totalRatings: number) => {
        if (totalRatings < 5) {
            return {
                level: 'low',
                reason: `you haven't rated enough food experiences yet (${totalRatings} ratings). ` +
                    `Try rating more cuisines to improve accuracy!`,
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

    const getGroupAccuracyExplanation = (totalGroupMembers: number, totalGroupRatings: number) => {
        if (totalGroupMembers < 2) {
            return {
                level: 'limited',
                reason: `your group only has ${totalGroupMembers} member. Group recommendations work better with more diverse preferences.`,
                action: 'Add more members to improve group recommendations',
                color: 'orange'
            };
        } else if (totalGroupRatings < 10) {
            return {
                level: 'building',
                reason: `your group members have given ${totalGroupRatings} total ratings. We need more group data to understand collective preferences.`,
                action: 'Group members should rate more experiences together',
                color: 'orange'
            };
        } else if (totalGroupRatings < 50) {
            return {
                level: 'improving',
                reason: `your group has ${totalGroupMembers} members with ${totalGroupRatings} total ratings. We're learning your group's collective taste.`,
                action: 'Keep dining together and rating experiences',
                color: 'blue'
            };
        } else {
            return {
                level: 'strong',
                reason: `your group has ${totalGroupMembers} members with extensive rating history (${totalGroupRatings} total ratings).`,
                action: 'Your group recommendations are highly personalized',
                color: 'green'
            };
        }
    };

    // Process recommendations to avoid duplicates
    const processRecommendations = () => {
        const mainRecommendations = recommendationsData?.data?.recommendations || [];
        const discoverRecommendations = discoverData?.data?.recommendations || [];
        
        // Create a Set to track cuisine names and avoid duplicates
        const seenCuisines = new Set<string>();
        const finalRecommendations = [];

        // Add main recommendations first
        for (const item of mainRecommendations) {
            if (!seenCuisines.has(item.cuisineName)) {
                seenCuisines.add(item.cuisineName);
                finalRecommendations.push({
                    ...item,
                    type: 'main',
                    isDiscoverMode: false
                });
            }
        }

        // Add discover recommendations that aren't already included
        for (const item of discoverRecommendations) {
            if (!seenCuisines.has(item.cuisineName) && finalRecommendations.length < 8) {
                seenCuisines.add(item.cuisineName);
                finalRecommendations.push({
                    ...item,
                    type: 'discover',
                    isDiscoverMode: true
                });
            }
        }

        // Shuffle the final array to mix main and discover recommendations
        return finalRecommendations
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);
    };

    const finalRecommendations = processRecommendations();
    const userInfo = recommendationsData?.data || discoverData?.data;

    const accuracyInfo = userInfo ?
        (type === 'group' && selectedGroupId
            ? getGroupAccuracyExplanation(userGroups.find(g => g._id === selectedGroupId)?.userCount || 0, userInfo.totalRatings)
            : getRecommendationAccuracyExplanation(userInfo.totalRatings)
        ) : null;

    const getReasoningLabel = (item: any) => {
        if (item.type === 'main') {
            if (item.confidenceLevel >= 0.8) return 'Based on your preferences';
            if (item.confidenceLevel >= 0.5) return 'Popular with similar users';
            return 'You might also like';
        } else {
            return 'Try something new';
        }
    };

    const renderSkeletonGrid = () => {
        return (
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 2, lg: 4 }}
                spacing="md"
            >
                {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} height={300} radius="md" animate />
                ))}
            </SimpleGrid>
        );
    };

    const renderCuisineGrid = () => {
        if (type === 'group' && !selectedGroupId) {
            return (
                <Alert icon={<IconInfoCircle size={16} />} title="Select a group" color="blue">
                    Please select a group to see recommendations.
                    If you are not in a group, please join one to use this feature.
                </Alert>
            );
        }

        if (finalRecommendations.length === 0) {
            return (
                <Alert icon={<IconInfoCircle size={16} />} title="No recommendations" color="blue">
                    No recommendations available at the moment.
                </Alert>
            );
        }

        return (
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 2, lg: 4 }}
                spacing="md"
                className={`${classes.cuisineGrid} ${switching ? classes.switching : ''}`}
            >
                {finalRecommendations.map((item: any, index: number) => (
                    <CuisineCard
                        key={`${item.cuisineName}-${item.type}-${index}`}
                        cuisineName={item.cuisineName}
                        score={item.score}
                        reasoning={getReasoningLabel(item)}
                        confidenceLevel={item.type === 'main' ? item.confidenceLevel : undefined}
                        discoveryLevel={item.type === 'discover' ? item.discoveryLevel : undefined}
                        onShowDetails={() => handleShowDetails(item.cuisineName)}
                        onLike={() => handleLikeCuisine(item.cuisineName)}
                        variant="compact"
                        isLiked={favourites.includes(item.cuisineName)}
                        isDiscoverMode={item.isDiscoverMode}
                    />
                ))}
            </SimpleGrid>
        );
    };

    const totalLoading = isLoading || isDiscoverLoading;

    return (
        <Container my="md" className={classes.container}>
            <Paper withBorder p="lg" radius="md" mb="xl" className={classes.header}>
                <Group justify="space-between" align="center">
                    <div>
                        <Text size="xl" fw={600} mb="xs">
                            Your personalized food recommendations
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
                            Curated suggestions combining your preferences with discovery opportunities
                        </Text>
                        {type === 'group' && (
                            <Select
                                placeholder="Select a group"
                                value={selectedGroupId}
                                onChange={(value) => {
                                    const newGroupId = value || '';
                                    navigate({
                                        to: '/recommendations',
                                        search: { type: 'group', ...(newGroupId && { groupId: newGroupId }) }
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        const input = event.target as HTMLInputElement;
                                        const matchedGroup = userGroups?.find(g =>
                                            g.name.toLowerCase().includes(input.value.toLowerCase())
                                        );
                                        if (matchedGroup) {
                                            navigate({
                                                to: '/recommendations',
                                                search: { type: 'group', groupId: matchedGroup._id }
                                            });
                                        }
                                    }
                                }}
                                data={[
                                    { value: '', label: 'No group selected' },
                                    ...userGroups?.map(g => ({
                                        value: g._id,
                                        label: g.name,
                                    })) || []
                                ]}
                                mt="md"
                                clearable
                                searchable
                                w={300}
                            />
                        )}
                    </div>
                    <Group>
                        <SegmentedControl
                            value={type}
                            onChange={(value) => handleModeChange(value as 'personal' | 'group')}
                            data={[
                                { label: 'Personal', value: 'personal' },
                                { label: 'Group', value: 'group' }
                            ]}
                        />
                        <ActionIcon
                            variant="light"
                            size="lg"
                            onClick={refetchAll}
                            disabled={totalLoading}
                            title="Refresh recommendations"
                        >
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>

            {accuracyInfo && (
                <Paper withBorder p="md" radius="md" mb="xl">
                    <Stack gap="sm">
                        <Group gap="xs">
                            <IconInfoCircle size={16} color={accuracyInfo.color} />
                            <Text size="sm" fw={500} c={accuracyInfo.color}>
                                {type === 'group'
                                    ? `Group recommendation accuracy is ${accuracyInfo.level}`
                                    : `Your recommendation accuracy is ${accuracyInfo.level}`
                                }
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            This is because {accuracyInfo.reason}
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

            {totalLoading ? renderSkeletonGrid() : renderCuisineGrid()}

            {finalRecommendations.length > 0 && (
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