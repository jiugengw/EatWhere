import {
  Container,
  Title,
  Slider,
  Stack,
  Paper,
  Button,
  Divider,
} from "@mantine/core";
import { useEffect, useState, type JSX } from "react";
import { useUserPreferences } from "@/hooks/users/usePreferences";
import { useUpdateUserPreferences } from "@/hooks/users/useUpdatePreferences";
import classes from "./preference.module.css";

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

type PreferencesState = Record<string, number>;

export const PreferencesPage = (): JSX.Element => {
  const { data } = useUserPreferences();
  const { mutate, isPending } = useUpdateUserPreferences();
  const backendPreferences = data?.data?.user?.preferences || {};

  const [preferences, setPreferences] = useState<PreferencesState | null>(null);

  useEffect(() => {
    if (data?.data?.user?.preferences) {
      const initial = cuisines.reduce((acc, cuisine) => {
        acc[cuisine] = backendPreferences[cuisine] ?? 3;
        return acc;
      }, {} as PreferencesState);
      setPreferences(initial);
    }
  }, [backendPreferences]);

  const handleSliderChange = (cuisine: string, value: number) => {
    if (!preferences) return;
    setPreferences((prev) => ({ ...prev, [cuisine]: value }));
  };

  const handleSubmit = () => {
    if (!preferences) return;

    const payload = Object.entries(preferences).map(([cuisine, points]) => ({
      cuisine,
      points,
    }));

    mutate(payload);
  };

  if (!preferences) return <div>Loading preferences...</div>;

  return (
    <Container size="sm" my="xl">
      <Title mb="xl" className={classes.header}>
        Cuisine Preferences
      </Title>

      <Paper withBorder shadow="md" p="xl" radius="md" className={classes.paper}>
        <Stack gap="xl" className={classes.sliderStack}>
          {cuisines.map((cuisine, index) => (
            <div key={cuisine} className={classes.sliderContainer}>
              <Title order={5} mb="xs" className={classes.sliderLabel}>
                {cuisine}
              </Title>

              <Slider
                value={preferences[cuisine]}
                onChange={(value: number) =>
                  handleSliderChange(cuisine, value)
                }
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: "Dislike" },
                  { value: 3, label: "Neutral" },
                  { value: 5, label: "Like" },
                ]}
                styles={{
                  track: { backgroundColor: "#e0e0e0" },
                  bar: { backgroundColor: "#FF8C42" },
                  thumb: {
                    borderColor: "#FF8C42",
                    backgroundColor: "white",
                  },
                }}
              />

              {index !== cuisines.length - 1 && (
                <Divider my="lg" className={classes.divider} />
              )}
            </div>
          ))}
        </Stack>
      </Paper>

      <Button
        fullWidth
        mt="xl"
        radius="xl"
        size="md"
        loading={isPending}
        className={classes.saveButton}
        onClick={handleSubmit}
      >
        Save Preferences
      </Button>
    </Container>
  );
};
