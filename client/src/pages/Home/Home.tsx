import {
  Container,
  Text,
  Card,
  Button,
  Group,
  Image,
  Stack,
  Title,
  Avatar,
  SimpleGrid,
  Box,
  Center,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import type { JSX } from 'react';

interface RecommendedItem {
  title: string;
  img: string;
}

interface UserReview {
  name: string;
  review: string;
}

export const HomePage =(): JSX.Element => {
  const recommendedPlaces: RecommendedItem[] = [
    {
      title: 'Sushi Place',
      img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Italian Bistro',
      img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Burger Joint',
      img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const userReviews: UserReview[] = [
    { name: 'Alex Tan', review: '“Amazing food suggestions every time!”' },
    { name: 'Sarah Lee', review: '“Helped me discover new places to eat.”' },
    { name: 'David Lim', review: '“Super easy to decide where to dine!”' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          padding: '5rem 1rem',
          textAlign: 'center',
        }}
      >
        <Title order={1} size="3rem" mb="md" style={{ color: '#222222' }}>
          Where2Eat
        </Title>
        <Text size="lg" style={{ color: '#555555', marginBottom: '1.5rem' }}>
          Smarter food choices, tailored for you.
        </Text>
        <Center>
          <Button
            size="lg"
            radius="xl"
            style={{ backgroundColor: '#FF8C42', color: 'white' }}
          >
            Explore Now
          </Button>
        </Center>
        <Image
          src="https://images.unsplash.com/photo-1551218808-94e220e084d2"
          alt="Food Hero Image"
          radius="md"
          fit="cover"
          style={{
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginTop: '2rem',
          }}
        />
      </Box>

      {/* How It Works Section */}
      <Container size="lg" py="xl">
        <Title order={2} align="center" mb="xl" style={{ color: '#222222' }}>
          How It Works
        </Title>
        <Group grow position="center" spacing="xl">
          {['Pick', 'Select', 'Dine'].map((step, index) => (
            <Card
              key={index}
              withBorder
              radius="md"
              padding="xl"
              shadow="sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#e0e0e0' }}
            >
              <Title order={4} style={{ color: '#222222' }}>
                {step}
              </Title>
              <Text size="sm" style={{ color: '#555555' }}>
                {step === 'Pick' &&
                  'Indicate your dining preferences and occasion.'}
                {step === 'Select' &&
                  'Select the number of people joining the meal.'}
                {step === 'Dine' &&
                  'Let our algorithm suggest the perfect place for you to enjoy!'}
              </Text>
            </Card>
          ))}
        </Group>
        <Center mt="lg">
          <Group>
            <Button
              radius="xl"
              style={{ backgroundColor: '#FF8C42', color: 'white' }}
            >
              Log In
            </Button>
            <Button
              variant="outline"
              radius="xl"
              style={{ color: '#FF8C42', borderColor: '#FF8C42' }}
            >
              Sign Up
            </Button>
          </Group>
        </Center>
      </Container>

      {/* Most Recommended Section */}
      <Box style={{ backgroundColor: '#FFFFFF', padding: '3rem 0' }}>
        <Container size="lg">
          <Title order={2} align="center" mb="xl" style={{ color: '#222222' }}>
            Most Recommended
          </Title>

          <SimpleGrid
            cols={3}
            spacing="xl"
            breakpoints={[
              { maxWidth: 'md', cols: 2 },
              { maxWidth: 'sm', cols: 1 },
            ]}
          >
            {recommendedPlaces.map((item, idx) => (
              <Stack key={idx} align="center" spacing="sm">
                <Image
                  src={item.img}
                  alt={item.title}
                  radius="md"
                  fit="cover"
                  height={220}
                  width={300}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                />
                <Text
                  weight={500}
                  style={{ color: '#222222', textAlign: 'center' }}
                >
                  {item.title}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* User Reviews Section */}
      <Container size="lg" py="xl">
        <Title order={2} align="center" mb="xl" style={{ color: '#222222' }}>
          What People Say
        </Title>
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[{ maxWidth: 'md', cols: 1 }]}
        >
          {userReviews.map((user, idx) => (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ backgroundColor: '#FFFFFF', borderColor: '#e0e0e0' }}
            >
              <Text
                size="sm"
                style={{ color: '#555555', marginBottom: '1rem' }}
              >
                {user.review}
              </Text>
              <Group spacing="sm" mt="md">
                <Avatar radius="xl">
                  <IconUser size={20} />
                </Avatar>
                <Text weight={500} style={{ color: '#222222' }}>
                  {user.name}
                </Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <Footer />
    </>
  );
}

