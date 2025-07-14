import {
    Container,
    Title,
    Text,
    Button,
    Stack,
    Paper,
    SimpleGrid,
} from '@mantine/core';
import { IconSparkles, IconSearch } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import classes from './FindMyNextMeal.module.css';

export default function FindMyNextMealPage() {
    const navigate = useNavigate();

    const handleSuggestClick = () => {
        navigate({ to: '/recommendations/find-meal/suggest' });
    };

    const handleSearchClick = () => {
        navigate({
            to: '/recommendations/find-meal/search',
            search: { q: '' } 
        });
    }

    return (
        <Container size="sm" py="xl" className={classes.container}>
            <Stack gap="xl" align="center">
                <Paper withBorder p="xl" radius="lg" className={classes.header}>
                    <Title order={1} mb="md" className={classes.title}>
                        Find My Next Meal
                    </Title>
                    <Text size="lg" c="dimmed" mb="xl" className={classes.subtitle}>
                        Discover delicious food tailored just for you
                    </Text>
                </Paper>

                <SimpleGrid cols={1} spacing="xl" className={classes.optionsGrid}>
                    <Paper
                        withBorder
                        p="xl"
                        radius="lg"
                        className={classes.optionCard}
                        onClick={handleSuggestClick}
                    >
                        <Stack align="center" gap="md">
                            <div className={classes.iconContainer}>
                                <IconSparkles size={40} color="#FF8C42" />
                            </div>
                            <Title order={3} className={classes.optionTitle}>
                                Surprise me with suggestions
                            </Title>
                            <Text ta="center" c="dimmed" size="md" className={classes.optionDescription}>
                                Let our AI recommend cuisines based on your taste preferences
                            </Text>
                            <Button
                                size="lg"
                                radius="xl"
                                className={classes.suggestButton}
                                rightSection={<IconSparkles size={18} />}
                            >
                                Get Suggestions
                            </Button>
                        </Stack>
                    </Paper>

                    <Paper
                        withBorder
                        p="xl"
                        radius="lg"
                        className={classes.optionCard}
                        onClick={handleSearchClick}
                    >
                        <Stack align="center" gap="md">
                            <div className={`${classes.iconContainer} ${classes.iconContainerBlue}`}>
                                <IconSearch size={40} color="#4285f4" />
                            </div>
                            <Title order={3} className={classes.optionTitle}>
                                I know what I had
                            </Title>
                            <Text ta="center" c="dimmed" size="md" className={classes.optionDescription}>
                                Search and rate a restaurant or dish you recently tried
                            </Text>
                            <Button
                                size="lg"
                                radius="xl"
                                className={classes.searchButton}
                                rightSection={<IconSearch size={18} />}
                            >
                                Search & Rate
                            </Button>
                        </Stack>
                    </Paper>
                </SimpleGrid>
            </Stack>
        </Container>
    );
}