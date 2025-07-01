import { ExplorePage } from '@/pages/Explore/Explore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explore')({
  component: ExplorePage,
})


