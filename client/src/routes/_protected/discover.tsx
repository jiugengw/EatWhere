import { DiscoverPage } from '@/pages/Discover/Discover'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/discover')({
  component: DiscoverPage,
})


