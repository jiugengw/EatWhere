import { createFileRoute } from "@tanstack/react-router";
import PlacesTest from "@/pages/test";
export const Route = createFileRoute("/test")({
  component: PlacesTest,
});
