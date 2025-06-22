import { useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';
import Footer from '../shared/components/footer';
import diningImg1 from "../../assets/images/dining_img1.jpg";
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
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

function Home() {
  const [name, setName] = useState("nothing");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setName(decoded.id);
      console.log(decoded.id);
    }
  }, []);

  return (
    <>
    <h1>{name}</h1>
      <Container >
        <br />
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ maxWidth: 950, margin: "auto" }}
        >
          <Group align="stretch" spacing="xl">
            <Stack>
              <Title order={1}>Where2Eat</Title>
              <Text>
                Smarter food choices, tailored for you. Don't know what to eat?
                Try and see for yourself!
              </Text>
              <Button
                variant="filled"
                size="md"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  margin: "auto",
                }}
              >
                Explore
              </Button>
              <Image
                src={diningImg1}
                alt="diningImg"
                radius="md"
                style={{ width: 950, height: 400, objectFit: "cover" }}
              />
            </Stack>
          </Group>
        </Card>

        <br />
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ maxWidth: 950, margin: "auto" }}
        >
          <Group align="stretch" spacing="xl">
            <Stack justify="space-between" style={{ flex: 1, minWidth: 0 }}>
              <div>
                <Title order={3}>How to use?</Title>
                <br />
                <Text>
                  <b>Pick</b>
                  <br />
                  Pick occasion for your meal
                  <br />
                  <br />
                  <b>Select</b>
                  <br />
                  Select how many pax for your meal
                  <br />
                  <br />
                  <b>Dine</b>
                  <br />
                  Dine at the suggested location based on your preference!
                </Text>
              </div>
              <Group grow>
                <Button
                  variant="filled"
                  size="md"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Log In
                </Button>
                <Button variant="outline" size="md" style={{ color: "black" }}>
                  Sign Up
                </Button>
              </Group>
            </Stack>

            <Image
              src={diningImg1}
              alt="diningImg"
              radius="md"
              style={{ width: 475, height: "auto", objectFit: "cover" }}
            />
          </Group>
        </Card>

        <br />
        <Title order={2} style={{ textAlign: "left", marginBottom: "1rem" }}>
          Most Recommended
        </Title>
        <Group position="apart" align="flex-start" spacing="xl" grow>
          <Stack align="left" spacing="xs">
            <Image
              src={diningImg1}
              alt="diningimg"
              radius="md"
              fit="cover"
              height={200}
            />
            <Text style={{ fontWeight: 500 }}>
              <b>#1</b>
            </Text>
          </Stack>
          <Stack align="left" spacing="xs">
            <Image
              src={diningImg1}
              alt="diningimg"
              radius="md"
              fit="cover"
              height={200}
            />
            <Text style={{ fontWeight: 500 }}>
              <b>#2</b>
            </Text>
          </Stack>
        </Group>

        <Container my="xl">
          <Title order={2} style={{ textAlign: "left", marginBottom: "1rem" }}>
            User Reviews
          </Title>

          <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text style={{ marginBottom: "1rem" }}>
                “Nathaniel Teo Kukubird”
              </Text>
              <Group spacing="sm" style={{ marginTop: "1rem" }}>
                <Avatar radius="xl">
                  <IconUser size={20} />
                </Avatar>
                <Text style={{ fontWeight: 500 }}>Ernest Wong</Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text style={{ marginBottom: "1rem" }}>
                “Nathaniel Teo Kukubird”
              </Text>
              <Group spacing="sm" style={{ marginTop: "1rem" }}>
                <Avatar radius="xl">
                  <IconUser size={20} />
                </Avatar>
                <Text style={{ fontWeight: 500 }}>Wong Jiu Geng</Text>
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text style={{ marginBottom: "1rem" }}>“I like Kukubird”</Text>
              <Group spacing="sm" style={{ marginTop: "1rem" }}>
                <Avatar radius="xl">
                  <IconUser size={20} />
                </Avatar>
                <Text style={{ fontWeight: 500 }}>Nathaniel Teo</Text>
              </Group>
            </Card>
          </SimpleGrid>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
