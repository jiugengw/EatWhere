// client/src/pages/LandingPage/LandingPage.tsx
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  SimpleGrid,
  Badge,
  Center,
  ThemeIcon,
  Box,
  Stack,
  Overlay,
  Group,
} from "@mantine/core";
import {
  IconChefHat,
  IconUsers,
  IconStar,
  IconSparkles,
  IconTrendingUp,
  IconHeart,
  IconArrowRight,
  IconLogin,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./LandingPage.module.css";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/auth/useAuth";

export function LandingPage() {
  const { auth } = useAuth();
  const isLoggedIn = !!auth.token;

  return (
    <Box>
      <div className={classes.wrapper}>
        <Overlay color="#000" opacity={0.6} zIndex={1} />

        <div className={classes.inner}>
          <Center>
            <Badge
              variant="light"
              color="orange"
              size="lg"
              leftSection={<IconSparkles size={16} />}
              className={classes.badge}
            >
              Personalised Food Discovery
            </Badge>
          </Center>

          <Title className={classes.title}>
            Smart Food Recommendations for{" "}
            <Text component="span" inherit className={classes.highlight}>
              Every Craving
            </Text>
          </Title>

          <Container size={640}>
            <Text size="xl" className={classes.description}>
              Discover your perfect meal with our app that learns your taste
              preferences, suggests group dining options, and helps you explore
              new cuisines with confidence.
            </Text>
          </Container>

          <div className={classes.controls}>
            {!isLoggedIn ? (
              <>
                <Button
                  size="lg"
                  className={classes.control}
                  variant="white"
                  c="dark"
                  rightSection={<IconArrowRight size={20} />}
                  component={Link}
                  to="/signup"
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  className={`${classes.control} ${classes.secondaryControl}`}
                  leftSection={<IconLogin size={20} />}
                  component={Link}
                  to="/login"
                >
                  I already have an account
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className={classes.control}
                  variant="white"
                  c="dark"
                  rightSection={<IconChefHat size={20} />}
                  component={Link}
                  to="/discover"
                >
                  Get Recommendations
                </Button>
                <Button
                  size="lg"
                  className={`${classes.control} ${classes.secondaryControl}`}
                  leftSection={<IconSearch size={20} />}
                  component={Link}
                  to="/search"
                >
                  Search Restaurants
                </Button>
                <Button
                  size="lg"
                  className={`${classes.control} ${classes.secondaryControl}`}
                  leftSection={<IconUsers size={20} />}
                  component={Link}
                  to="/group"
                >
                  My Groups
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={classes.featuresSection}>
        <Container size="lg">
          <Stack align="center" className={classes.sectionHeader}>
            <Title order={2} className={classes.sectionTitle}>
              Why Use Our App?
            </Title>
            <Text
              size="xl"
              c="dimmed"
              ta="center"
              className={classes.sectionDescription}
            >
              Our intelligent recommendation system learns your personal
              preferences to deliver perfectly tailored food suggestions.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            <Card
              shadow="md"
              padding="xl"
              radius="lg"
              withBorder
              className={classes.featureCard}
            >
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                mb="md"
              >
                <IconChefHat size={32} />
              </ThemeIcon>
              <Title order={3} size="xl" mb="sm">
                Personal AI Chef
              </Title>
              <Text c="dimmed">
                Our system learns from your ratings and preferences, adapting to
                your taste profile over time. The more you use it, the better it
                gets at predicting what you'll love.
              </Text>
              {isLoggedIn && (
                <Button
                  variant="light"
                  color="orange"
                  mt="md"
                  component={Link}
                  to="/discover"
                  leftSection={<IconChefHat size={16} />}
                >
                  Try Now
                </Button>
              )}
            </Card>

            <Card
              shadow="md"
              padding="xl"
              radius="lg"
              withBorder
              className={classes.featureCard}
            >
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: "blue", to: "indigo" }}
                mb="md"
              >
                <IconUsers size={32} />
              </ThemeIcon>
              <Title order={3} size="xl" mb="sm">
                Group Harmony
              </Title>
              <Text c="dimmed">
                Planning dinner with friends? We consider everyone's preferences
                and dietary restrictions to find restaurants that satisfy the
                entire group, making group dining decisions effortless.
              </Text>
              {isLoggedIn && (
                <Button
                  variant="light"
                  color="blue"
                  mt="md"
                  component={Link}
                  to="/group"
                  leftSection={<IconUsers size={16} />}
                >
                  Explore Groups
                </Button>
              )}
            </Card>

            <Card
              shadow="md"
              padding="xl"
              radius="lg"
              withBorder
              className={classes.featureCard}
            >
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: "purple", to: "pink" }}
                mb="md"
              >
                <IconSparkles size={32} />
              </ThemeIcon>
              <Title order={3} size="xl" mb="sm">
                Smart Discovery
              </Title>
              <Text c="dimmed">
                Step out of your comfort zone and discover hidden gems. Our
                explore feature suggests new restaurants and cuisines tailored
                to your adventurous side.
              </Text>
              {isLoggedIn && (
                <Button
                  variant="light"
                  color="purple"
                  mt="md"
                  component={Link}
                  to="/search"
                  leftSection={<IconSearch size={16} />}
                >
                  Start Searching
                </Button>
              )}
            </Card>
          </SimpleGrid>
        </Container>
      </div>

      <div className={classes.howItWorksSection}>
        <Container size="lg">
          <Stack align="center" className={classes.sectionHeader}>
            <Title order={2} className={classes.sectionTitle}>
              How It Works
            </Title>
            <Text
              size="xl"
              c="dimmed"
              ta="center"
              className={classes.sectionDescription}
            >
              Our three-step process makes finding your perfect meal simple and
              intelligent.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            <Stack align="center" ta="center" className={classes.stepCard}>
              <ThemeIcon
                size={80}
                radius="xl"
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
              >
                <IconStar size={40} />
              </ThemeIcon>
              <Title order={3} size="xl">
                Rate & Learn
              </Title>
              <Text c="dimmed">
                Rate cuisines you've tried. Our AI learns your preferences and
                builds your unique taste profile.
              </Text>
            </Stack>

            <Stack align="center" ta="center" className={classes.stepCard}>
              <ThemeIcon
                size={80}
                radius="xl"
                variant="gradient"
                gradient={{ from: "blue", to: "indigo" }}
              >
                <IconTrendingUp size={40} />
              </ThemeIcon>
              <Title order={3} size="xl">
                Get Recommendations
              </Title>
              <Text c="dimmed">
                Receive personalized recommendations that get better over time,
                tailored specifically to your tastes.
              </Text>
            </Stack>

            <Stack align="center" ta="center" className={classes.stepCard}>
              <ThemeIcon
                size={80}
                radius="xl"
                variant="gradient"
                gradient={{ from: "purple", to: "pink" }}
              >
                <IconHeart size={40} />
              </ThemeIcon>
              <Title order={3} size="xl">
                Discover & Enjoy
              </Title>
              <Text c="dimmed">
                Explore new cuisines with confidence or find group favorites
                that everyone will love.
              </Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </div>

      {/* Quick Actions Section for Logged In Users */}
      {isLoggedIn && (
        <div className={classes.ctaSection}>
          <Container size="lg">
            <Stack align="center" ta="center">
              <Title order={2} className={classes.ctaTitle}>
                Ready to Find Your Next Meal?
              </Title>
              <Text size="xl" className={classes.ctaDescription}>
                Jump right into discovering amazing restaurants or get personalized recommendations.
              </Text>

              <Group gap="md">
                <Button
                  size="xl"
                  variant="white"
                  c="orange"
                  rightSection={<IconSearch size={20} />}
                  className={classes.ctaButton}
                  component={Link}
                  to="/search"
                >
                  Search Restaurants
                </Button>
                
                <Button
                  size="xl"
                  variant="outline"
                  c="white"
                  style={{ borderColor: 'white' }}
                  rightSection={<IconChefHat size={20} />}
                  component={Link}
                  to="/discover"
                >
                  Get Recommendations
                </Button>
              </Group>

              <Text size="sm" className={classes.ctaSubtext}>
                🔍 Find nearby restaurants • 🤖 AI-powered suggestions • 👥 Group recommendations
              </Text>
            </Stack>
          </Container>
        </div>
      )}

      {/* Original CTA for Non-Logged In Users */}
      {!isLoggedIn && (
        <div className={classes.ctaSection}>
          <Container size="lg">
            <Stack align="center" ta="center">
              <Title order={2} className={classes.ctaTitle}>
                Ready to Transform Your Dining Experience?
              </Title>
              <Text size="xl" className={classes.ctaDescription}>
                Join thousands of food lovers who've discovered their perfect
                meals with our AI-powered recommendations.
              </Text>

              <Button
                size="xl"
                variant="white"
                c="orange"
                rightSection={<IconArrowRight size={20} />}
                className={classes.ctaButton}
                component={Link}
                to="/signup"
              >
                Start Your Food Journey
              </Button>

              <Text size="sm" className={classes.ctaSubtext}>
                ✨ Free forever • 🚀 No credit card required • 🎯 Instant
                recommendations
              </Text>
            </Stack>
          </Container>
        </div>
      )}
    </Box>
  );
}