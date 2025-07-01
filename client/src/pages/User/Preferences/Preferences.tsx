import {
  Container,
  Title,
  Slider,
  Stack,
  Paper,
  Button,
  Divider,
} from '@mantine/core';
import { useState, type JSX } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const cuisines: string[] = [
  'Chinese',
  'Korean',
  'Japanese',
  'Italian',
  'Mexican',
  'Indian',
  'Thai',
  'French',
  'Fast Food',
  'Muslim',
  'Vietnamese',
  'Western',
];

type PreferencesState = Record<string, number>;

export const PreferencesPage = (): JSX.Element => {
  const [preferences, setPreferences] = useState<PreferencesState>(
    cuisines.reduce(
      (acc, cuisine) => ({ ...acc, [cuisine]: 3 }),
      {} as PreferencesState
    ) // Default to 3 (midpoint)
  );

  const handleSliderChange = (cuisine: string, value: number) => {
    setPreferences((prev) => ({ ...prev, [cuisine]: value }));
  };

  const handleSubmit = () => {
    alert('Preferences saved:\n' + JSON.stringify(preferences, null, 2));
  };

  return (
    <>
      <Navbar />

      <Container size="sm" my="xl">
        <Title
          align="center"
          mb="xl"
          style={{ color: '#222222', fontWeight: 700, letterSpacing: '-0.5px' }}
        >
          Cuisine Preferences
        </Title>

        <Paper
          withBorder
          shadow="md"
          p="xl"
          radius="md"
          style={{
            maxHeight: '500px',
            maxWidth: '600px',
            margin: '0 auto',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            borderColor: '#e0e0e0',
          }}
        >
          <Stack
            spacing="xl"
            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
          >
            {cuisines.map((cuisine, index) => (
              <div
                key={cuisine}
                style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
              >
                <Title
                  order={5}
                  mb="xs"
                  style={{ color: '#222222', fontWeight: 600 }}
                >
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
                    { value: 1, label: 'Dislike' },
                    { value: 3, label: 'Neutral' },
                    { value: 5, label: 'Like' },
                  ]}
                  styles={{
                    track: { backgroundColor: '#e0e0e0' },
                    bar: { backgroundColor: '#FF8C42' },
                    thumb: { borderColor: '#FF8C42', backgroundColor: 'white' },
                  }}
                />

                {index !== cuisines.length - 1 && (
                  <Divider my="lg" style={{ borderColor: '#e0e0e0' }} />
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
          style={{
            backgroundColor: '#FF8C42',
            color: 'white',
            fontWeight: 600,
            maxWidth: '600px',
            margin: '1rem auto 0 auto',
            display: 'block',
          }}
          onClick={handleSubmit}
        >
          Save Preferences
        </Button>
      </Container>

      <Footer />
    </>
  );
};
