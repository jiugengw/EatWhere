import {
  Button,
  Container,
  Stack,
  Title,
  Text,
  Card,
  Group,
  Image,
  Box,
  Center,
  SimpleGrid,
} from '@mantine/core';
import { useState, type JSX } from 'react';
// Type for each cuisine
type Cuisine = {
  name: string;
  img: string;
};

// Cuisine data
const cuisines: Cuisine[] = [
  {
    name: 'Japanese',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  },
  {
    name: 'Italian',
    img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
  },
  {
    name: 'Mexican',
    img: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
  },
  {
    name: 'Thai',
    img: 'https://images.unsplash.com/photo-1604909053514-7e41e47f6f4d',
  },
  {
    name: 'Indian',
    img: 'https://images.unsplash.com/photo-1600628422019-74d9d2a470e0',
  },
];

export const ExplorePage = (): JSX.Element => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const randomize = (): void => {
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    setSelectedCuisine(cuisine.name);
    setSelectedLocation('Your current location');
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <Title
          order={1}
          style={{
            color: '#222222',
            fontSize: '2.75rem',
            marginBottom: '1rem',
          }}
        >
          Ready to Explore?
        </Title>
        <Text size="lg" style={{ color: '#555555', marginBottom: '1.5rem' }}>
          Discover exciting cuisines and dining spots tailored for you.
        </Text>
        <Center>
          <Button
            radius="xl"
            size="md"
            style={{
              backgroundColor: '#FF8C42',
              color: 'white',
              fontWeight: 600,
              padding: '10px 24px',
              fontSize: '1rem',
              lineHeight: '1.2rem',
            }}
            onClick={randomize}
          >
            Suggest Me Something!
          </Button>
        </Center>
      </Box>

      {/* Popular Cuisines */}
      <Container size="lg" my="xl">
        <Title order={2} align="center" mb="lg" style={{ color: '#222222' }}>
          Popular Cuisines
        </Title>

        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[{ maxWidth: 'md', cols: 1 }]}
        >
          {cuisines.map((cuisine, index) => (
            <Card
              key={index}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              style={{ backgroundColor: '#FFFFFF', borderColor: '#e0e0e0' }}
            >
              <Image
                src={cuisine.img}
                height={180}
                radius="md"
                alt={`${cuisine.name} food`}
                fit="cover"
              />
              <Title order={4} mt="sm" style={{ color: '#222222' }}>
                {cuisine.name}
              </Title>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Explore Buttons */}
      <Container size="md" my="xl">
        <Stack spacing="lg" align="center">
          <Group spacing="md">
            <Button
              radius="xl"
              size="md"
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                fontWeight: 600,
                padding: '10px 24px',
                fontSize: '1rem',
              }}
              onClick={randomize}
            >
              Explore With Group
            </Button>

            <Button
              radius="xl"
              size="md"
              variant="outline"
              style={{
                color: '#FF8C42',
                border: '1px solid #FF8C42',
                fontWeight: 600,
                padding: '10px 24px',
                fontSize: '1rem',
                backgroundColor: 'white',
              }}
              onClick={randomize}
            >
              Explore Solo
            </Button>
          </Group>

          {selectedCuisine && (
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                maxWidth: 600,
                width: '100%',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderColor: '#e0e0e0',
              }}
            >
              <Text
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: '#222222',
                }}
              >
                Suggested Option
              </Text>
              <Text
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Cuisine: {selectedCuisine}
              </Text>
              <Text style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                Location: {selectedLocation}
              </Text>
            </Card>
          )}
        </Stack>
      </Container>
    </>
  );
};
