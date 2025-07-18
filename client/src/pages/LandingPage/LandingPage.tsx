import {
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Badge,
  Center,
  ThemeIcon,
  Box,
  Stack,
  Overlay,
} from "@mantine/core";
import {
  IconStar,
  IconSparkles,
  IconTrendingUp,
  IconHeart,
  IconArrowRight,
  IconLogin,
} from "@tabler/icons-react";
import classes from "./LandingPage.module.css";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/auth/useAuth";

export function LandingPage() {
  const { auth } = useAuth();
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
            {!!!auth.token && <Button
              size="lg"
              className={classes.control}
              variant="white"
              c="dark"
              rightSection={<IconArrowRight size={20} />}
              component={Link}
              to="/signup"
            >
              Get Started Free
            </Button>}
            {!!!auth.token && <Button
              size="lg"
              className={`${classes.control} ${classes.secondaryControl}`}
              leftSection={<IconLogin size={20} />}
              component={Link}
              to="/login"
            >
              I already have an account
            </Button>}
          </div>
        </div>
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
                Rate cuisines you've tried. Our app learns your preferences and
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

      <div className={classes.ctaSection}>
        <Container size="lg">
          <Stack align="center" ta="center">
            <Title order={2} className={classes.ctaTitle}>
              Ready to Transform Your Dining Experience?
            </Title>
            <Text size="xl" className={classes.ctaDescription}>
              Join thousands of food lovers who've discovered their perfect
              meals with our recommendations.
            </Text>

            <Button
              size="xl"
              variant="white"
              c="orange"
              rightSection={<IconArrowRight size={20} />}
              className={classes.ctaButton}
            >
              Start Your Food Journey
            </Button>
          </Stack>
        </Container>
      </div>
    </Box>
  );
}
