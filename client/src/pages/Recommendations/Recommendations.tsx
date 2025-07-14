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
import classes from './recommendations.module.css';
import { useToggleFavourite } from '@/hooks/recommendations/useToggleFavourite';
import { useFavourites } from '@/hooks/recommendations/useFavourites';
import { Link } from '@tanstack/react-router';
import { useViewGroups } from '@/hooks/groups/useViewGroups';
import { useNavigate } from '@tanstack/react-router';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';

export const RecommendationsPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const type = searchParams.get('type') || 'personal';
    const urlMode = searchParams.get('mode') || 'top';
    const mode = `${type}-${urlMode}`;

    const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
        return searchParams.get('groupId') || '';
    });

    const [switching, setSwitching] = useState(false);
    const navigate = useNavigate();

    const handleMainModeChange = (mainMode: 'personal' | 'group') => {
        setSwitching(true);
        const subMode = urlMode;

        navigate({
            to: '/recommendations',
            search: {
                type: mainMode,
                mode: subMode,
                ...(selectedGroupId && { groupId: selectedGroupId })
            }
        });

        setTimeout(() => setSwitching(false), 100);
    };

    const handleSubModeChange = (subMode: 'top' | 'discover') => {
        setSwitching(true);

        navigate({
            to: '/recommendations',
            search: {
                type: type,
                mode: subMode,
                ...(selectedGroupId && { groupId: selectedGroupId })
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

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['recommendations', mode, selectedGroupId],
        queryFn: async () => {
            let endpoint = '/recommendations';

            if (mode === 'personal-top') {
                endpoint = '/recommendations?limit=4';
            } else if (mode === 'personal-discover') {
                endpoint = '/recommendations/discover?limit=4';
            } else if (mode === 'group-top' && selectedGroupId) {
                endpoint = `/recommendations/group/${selectedGroupId}?limit=4`;
            } else if (mode === 'group-discover' && selectedGroupId) {
                endpoint = `/recommendations/group/${selectedGroupId}/discover?limit=4`;
            }

            const res = await axiosPrivate.get(endpoint);
            return res.data;
        },
        enabled: mode.startsWith('group') ? !!selectedGroupId : true,
    });

    const handleShowDetails = (cuisineName: string) => {
        // Navigate to the cuisine page with the selected cuisine as a query parameter
        navigate({
            to: '/recommendations/cuisine',
            search: {
                cuisine: cuisineName,
                limit: '10' // Optional: set a default limit for restaurants
            }
        });
    };

    const handleLikeCuisine = (cuisineName: string) => {
        toggleFavourite(cuisineName);
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
    const accuracyInfo = userInfo ?
        (mode.startsWith('group') && selectedGroupId
            ? getGroupAccuracyExplanation(userGroups.find(g => g._id === selectedGroupId)?.userCount || 0, userInfo.totalRatings)
            : getRecommendationAccuracyExplanation(userInfo.totalRatings)
        ) : null;

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
        if (mode.startsWith('group') && !selectedGroupId) {
            return (
                <Alert icon={<IconInfoCircle size={16} />} title="Select a group" color="blue">
                    Please select a group to see recommendations.
                    If you are not in a group, please join one to use this feature.
                </Alert>
            );
        }

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
                        confidenceLevel={mode.endsWith('top') ? item.confidenceLevel : undefined}
                        discoveryLevel={mode.endsWith('discover') ? item.discoveryLevel : undefined}
                        onShowDetails={() => handleShowDetails(item.cuisineName)}
                        onLike={() => handleLikeCuisine(item.cuisineName)}
                        variant="compact"
                        isLiked={favourites.includes(item.cuisineName)}
                        isDiscoverMode={mode.endsWith('discover')}
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
                            {mode.endsWith('top')
                                ? "Your best matches based on preferences and dining history"
                                : "Enhanced scores for exploration to discover new flavours!"
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
                        <Stack gap="md">
                            <SegmentedControl
                                value={mode.startsWith('group') ? 'group' : 'personal'}
                                onChange={(value) => handleMainModeChange(value as 'personal' | 'group')}
                                data={[
                                    { label: 'Personal', value: 'personal' },
                                    { label: 'Group', value: 'group' }
                                ]}
                                fullWidth
                            />

                            <SegmentedControl
                                value={mode.endsWith('discover') ? 'discover' : 'top'}
                                onChange={(value) => handleSubModeChange(value as 'top' | 'discover')}
                                data={[
                                    { label: 'Top Picks', value: 'top' },
                                    { label: 'Discover', value: 'discover' }
                                ]}
                                fullWidth
                            />
                        </Stack>
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
            {mode.startsWith('group') && (
                <Select
                    placeholder="Select a group"
                    value={selectedGroupId}
                    onChange={(value) => setSelectedGroupId(value || '')}
                    data={[
                        { value: '', label: 'No group selected' },
                        ...userGroups?.map(g => ({
                            value: g._id,
                            label: g.name,
                            disabled: g._id === selectedGroupId
                        })) || []
                    ]}
                    mb="md"
                    clearable
                />
            )}

            {mode.endsWith('top') && accuracyInfo && (
                <Paper withBorder p="md" radius="md" mb="xl">
                    <Stack gap="sm">
                        <Group gap="xs">
                            <IconInfoCircle size={16} color={accuracyInfo.color} />
                            <Text size="sm" fw={500} c={accuracyInfo.color}>
                                {mode.startsWith('group')
                                    ? `Group recommendation accuracy is ${accuracyInfo.level}`
                                    : `Your recommendation accuracy is ${accuracyInfo.level}`
                                }
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            This is because {accuracyInfo.reason}
                        </Text>
                        <Text size="xs" c="dimmed" fs="italic">
                            Note: Individual cuisines may still show different confidence levels based on how certain we are about that specific cuisine {mode.startsWith('group') ? 'for your group' : 'for you'}.
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