import {
  Container,
  Title,
  Slider,
  Stack,
  Paper,
  Button,
  Divider,
  Text,
  Group,
  Badge,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconDeviceFloppy, IconAdjustments } from "@tabler/icons-react";
import { useUserPreferences } from "@/hooks/users/usePreferences";
import { useUpdateUserPreferences } from "@/hooks/users/useUpdatePreferences";
import classes from "./Preference.module.css";

const cuisines: string[] = [
  "Chinese",
  "Korean",
  "Japanese",
  "Italian",
  "Mexican",
  "Indian",
  "Thai",
  "French",
  "Fast Food",
  "Muslim",
  "Vietnamese",
  "Western",
];

const preferenceLabels = {
  1: { label: "Dislike", color: "red" },
  2: { label: "Not preferred", color: "orange" },
  3: { label: "Neutral", color: "gray" },
  4: { label: "Like", color: "blue" },
  5: { label: "Love", color: "green" },
};

type PreferencesState = Record<string, number>;

export const PreferencesPage = () => {
  const { data, isLoading } = useUserPreferences();
  const { mutate, isPending } = useUpdateUserPreferences();
  const backendPreferences = data?.data?.user?.preferences || {};

  const [preferences, setPreferences] = useState<PreferencesState | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data?.data?.user?.preferences) {
      const initial = cuisines.reduce((acc, cuisine) => {
        acc[cuisine] = backendPreferences[cuisine] ?? 3;
        return acc;
      }, {} as PreferencesState);
      setPreferences(initial);
    }
  }, [backendPreferences]);

  useEffect(() => {
    if (preferences && Object.keys(backendPreferences).length > 0) {
      const changed = Object.keys(preferences).some(
        cuisine => preferences[cuisine] !== (backendPreferences[cuisine] ?? 3)
      );
      setHasChanges(changed);
    }
  }, [preferences, backendPreferences]);

  const handleSliderChange = (cuisine: string, value: number) => {
    if (!preferences) return;
    setPreferences((prev) => ({ ...prev!, [cuisine]: value }));
  };

  const handleSubmit = () => {
    if (!preferences) return;

    const payload = Object.entries(preferences).map(([cuisine, points]) => ({
      cuisine,
      points,
    }));

    mutate(payload);
  };

  const resetToDefaults = () => {
    const defaultPrefs = cuisines.reduce((acc, cuisine) => {
      acc[cuisine] = 3;
      return acc;
    }, {} as PreferencesState);
    setPreferences(defaultPrefs);
  };

  if (isLoading || !preferences) {
    return (
      <Container size="sm" py="xl">
        <Box pos="relative" h={400}>
          <LoadingOverlay visible />
        </Box>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Box>
          <Group gap="sm" mb="xs">
            <IconAdjustments size={24} className={classes.headerIcon} />
            <Title order={2} className={classes.pageTitle}>
              Cuisine Preferences
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Rate your preferences for different cuisines to get better recommendations
          </Text>
        </Box>

        <Paper p="md" className={classes.legend}>
          <Group justify="space-between" gap="xs">
            <Text size="xs" c="dimmed">Dislike</Text>
            <Text size="xs" c="dimmed">Neutral</Text>
            <Text size="xs" c="dimmed">Love</Text>
          </Group>
        </Paper>

        <Paper className={classes.preferencesContainer}>
          <Stack gap="xl">
            {cuisines.map((cuisine, index) => (
              <Box key={cuisine}>
                <Group justify="space-between" mb="md">
                  <Text fw={500} className={classes.cuisineLabel}>
                    {cuisine}
                  </Text>
                  <Badge
                    size="sm"
                    variant="light"
                    color={preferenceLabels[preferences[cuisine] as keyof typeof preferenceLabels]?.color}
                    className={classes.preferenceBadge}
                  >
                    {preferenceLabels[preferences[cuisine] as keyof typeof preferenceLabels]?.label}
                  </Badge>
                </Group>

                <Slider
                  value={preferences[cuisine]}
                  onChange={(value: number) => handleSliderChange(cuisine, value)}
                  min={1}
                  max={5}
                  step={1}
                  label={null}
                  className={classes.slider}
                  classNames={{
                    track: classes.sliderTrack,
                    bar: classes.sliderBar,
                    thumb: classes.sliderThumb,
                  }}
                />

                {index !== cuisines.length - 1 && (
                  <Divider mt="xl" className={classes.divider} />
                )}
              </Box>
            ))}
          </Stack>
        </Paper>

        <Group grow>
          <Button
            variant="light"
            onClick={resetToDefaults}
            disabled={isPending}
            className={classes.resetButton}
          >
            Reset All
          </Button>
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            loading={isPending}
            disabled={!hasChanges}
            onClick={handleSubmit}
            className={classes.saveButton}
          >
            Save Preferences
          </Button>
        </Group>

        {hasChanges && (
          <Text size="xs" c="orange" ta="center" fw={500}>
            You have unsaved changes
          </Text>
        )}
      </Stack>
    </Container>
  );
};