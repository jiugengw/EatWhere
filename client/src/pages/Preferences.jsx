import {
  Container,
  Title,
  Slider,
  Stack,
  Paper,
  Button,
} from '@mantine/core';
import { useState } from 'react';
import Footer from '../shared/components/footer';

const cuisines = [
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

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState(
    cuisines.reduce((acc, cuisine) => ({ ...acc, [cuisine]: 5 }), {})
  );

  const handleSliderChange = (cuisine, value) => {
    setPreferences((prev) => ({ ...prev, [cuisine]: value }));
  };

  const handleSubmit = () => {
    alert('Preferences saved:\n' + JSON.stringify(preferences, null, 2));
  };

  return (
    <>
      <Container size="md" my="xl">
        <Title align="center" mb="lg">
          Cuisine Preferences
        </Title>
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Stack spacing="lg">
            {cuisines.map((cuisine) => (
              <div key={cuisine}>
                <Title order={5} mb="xs">
                  {cuisine}
                </Title>
                <Slider
                  value={preferences[cuisine]}
                  onChange={(value) => handleSliderChange(cuisine, value)}
                  min={0}
                  max={10}
                  marks={[
    { value: 0, label: 'Dislike' },
    { value: 5, label: 'Neutral' },
    { value: 10, label: 'Like' },
  ]}
                />
                <br></br>
              </div>
            ))}
  
            <br></br>
            <Button fullWidth mt="md" color="black" onClick={handleSubmit}>
              Save Preferences
            </Button>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
