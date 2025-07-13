import { createFileRoute } from '@tanstack/react-router'
import CuisinePage from '@/pages/Recommendations/Cuisines/Cuisines'

export const Route = createFileRoute('/recommendations/cuisine')({
  component: CuisinePage,
})
