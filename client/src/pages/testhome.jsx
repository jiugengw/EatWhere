import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Footer from "../shared/components/footer";
import diningImg1 from "../../assets/images/dining_img1.jpg";
// import diningImg1 from "../../assets/images/dining_img1.jpg";
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
import useAuth from "../shared/hooks/auth";
import { useNavigate } from "react-router-dom";

function TestHome() {
  const [name, setName] = useState("nothing");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setName(decoded.name);
    }
  }, []);

  return (
    <>
      <Container style={{ backgroundColor: "#FFF8ED", minHeight: "100vh", padding: "2rem 0" }}>
        <h1 style={{ color: "#272727" }}>Hello, {name}!</h1>
        <Button
          onClick={() => {
            navigate("/test");
          }}
          style={{ backgroundColor: "#D4AA7D", color: "#272727", marginBottom: "1rem" }}
        >
          click
        </Button>

        {/* Hero Section */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ maxWidth: 950, margin: "auto", backgroundColor: "#EFD09E" }}
        >
          <Group align="stretch" spacing="xl">
            <Stack>
              <Title order={1} style={{ color: "#D4AA7D" }}>
                Where2Eat
              </Title>
              <Text style={{ color: "#272727" }}>
                Smarter food choices, tailored for you. Don't know what to eat? Try and see for yourself!
              </Text>
              <Button
                variant="filled"
                size="md"
                style={{ backgroundColor: "#272727", color: "#EFD09E", margin: "auto" }}
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

        {/* How to Use Section */}
        <br />
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ maxWidth: 950, margin: "auto", backgroundColor: "#EFD09E" }}
        >
          <Group align="stretch" spacing="xl">
            <Stack justify="space-between" style={{ flex: 1, minWidth: 0 }}>
              <div>
                <Title order={3} style={{ color: "#D4AA7D" }}>
                  How to use?
                </Title>
                <br />
                <Text style={{ color: "#272727" }}>
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
                  style={{ backgroundColor: "#D4AA7D", color: "#272727" }}
                >
                  Log In
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  style={{ color: "#D4AA7D", borderColor: "#D4AA7D" }}
                >
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

        {/* Most Recommended */}
        <br />
        <Title order={2} style={{ textAlign: "left", marginBottom: "1rem", color: "#D4AA7D" }}>
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
            <Text style={{ fontWeight: 500, color: "#272727" }}>
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
            <Text style={{ fontWeight: 500, color: "#272727" }}>
              <b>#2</b>
            </Text>
          </Stack>
        </Group>

        {/* User Reviews */}
        <Container my="xl">
          <Title order={2} style={{ textAlign: "left", marginBottom: "1rem", color: "#D4AA7D" }}>
            User Reviews
          </Title>

          <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {[
              { text: "“Nathaniel Teo Kukubird”", name: "Ernest Wong" },
              { text: "“Nathaniel Teo Kukubird”", name: "Wong Jiu Geng" },
              { text: "“I like Kukubird”", name: "Nathaniel Teo" },
            ].map((review, index) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ backgroundColor: "#FFF8ED" }}
              >
                <Text style={{ marginBottom: "1rem", color: "#272727" }}>{review.text}</Text>
                <Group spacing="sm" style={{ marginTop: "1rem" }}>
                  <Avatar radius="xl">
                    <IconUser size={20} />
                  </Avatar>
                  <Text style={{ fontWeight: 500, color: "#272727" }}>{review.name}</Text>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default TestHome;
