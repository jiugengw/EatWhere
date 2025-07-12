import { useState } from 'react';
import {
  TextInput,
  Button,
  Card,
  Text,
  Stack,
  Loader,
  Badge,
  Image,
  Grid,
  Container,
  Title,
} from '@mantine/core';

export default function PlacesTest() {
  const [lat, setLat] = useState('1.3521');
  const [lng, setLng] = useState('103.8198');
  const [keyword, setKeyword] = useState('chinese');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPlaces = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    const url = `http://localhost:8080/api/test/places?lat=${lat}&lng=${lng}&keyword=${keyword}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        setError(`Google API error: ${data.status}`);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError('Failed to fetch data from backend.');
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (photoReference: string) =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=YOUR_GOOGLE_API_KEY`;

  return (
    <Container py="xl">
      <Title mb="md">Nearby Places Search</Title>

      <Stack spacing="md" mb="lg">
        <TextInput label="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
        <TextInput label="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
        <TextInput
          label="Cuisine (Keyword)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={fetchPlaces} loading={loading}>
          Search
        </Button>
      </Stack>

      {error && <Text color="red">{error}</Text>}
      {loading && <Loader />}

      <Grid>
        {results.map((place) => (
          <Grid.Col key={place.place_id} span={12} sm={6} md={4}>
            <Card shadow="md" padding="md" radius="md" withBorder>
              <Card.Section>
                <Image
                  height={200}
                  fit="cover"
                  src={
                    place.photos?.[0]?.photo_reference
                      ? getPhotoUrl(place.photos[0].photo_reference)
                      : 'https://via.placeholder.com/400x200.png?text=No+Image'
                  }
                  alt={place.name}
                />
              </Card.Section>

              <Stack spacing="xs" mt="sm">
                <Text fw={500}>{place.name}</Text>
                <Badge color={place.opening_hours?.open_now ? 'green' : 'red'} w="fit-content">
                  {place.opening_hours?.open_now ? 'Open Now' : 'Closed'}
                </Badge>
                <Text size="sm" color="dimmed">
                  {place.vicinity}
                </Text>
                <Text size="sm">
                  ⭐ {place.rating ?? 'N/A'} ({place.user_ratings_total ?? 0} reviews)
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
