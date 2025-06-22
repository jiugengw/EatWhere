import { Button, Container, Stack, Title, Text, Card, Group } from '@mantine/core';
import { useState } from 'react';
import Navbar from '../shared/components/navbar';
import Footer from '../shared/components/footer';

// Example cuisines and locations
const cuisines = ['Japanese', 'Italian', 'Mexican', 'Thai', 'Indian'];

function Explore() {
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const randomizeForGroup = () => {
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    setSelectedCuisine(cuisine);
    setSelectedLocation('Your current location');
  };

  const randomizeSolo = () => {
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    setSelectedCuisine(cuisine);
    setSelectedLocation('Your current location');
  };

  return (
    <>
      <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Explore Dining Options
        </Title>

        <Stack spacing="lg" align="center">
          <Group>
            <Button style={{ backgroundColor: 'black', color: 'white' }} onClick={randomizeForGroup}>
              Explore With Group
            </Button>
            <Button variant="outline" color="black" onClick={randomizeSolo}>
              Explore Solo
            </Button>
          </Group>

          {(selectedCuisine || selectedLocation) && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text style={{ fontSize: '1.125rem', fontWeight: 500 }}>Suggested Option</Text>
              <Text>Cuisine: {selectedCuisine}</Text>
              <Text>Location: {selectedLocation}</Text>
            </Card>
          )}
        </Stack>
      </Container>
      <Footer />
    </>
  );
}

export default Explore;
