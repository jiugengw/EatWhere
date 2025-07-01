import { HomePage } from '@/pages/Home/Home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: HomePage,
})

