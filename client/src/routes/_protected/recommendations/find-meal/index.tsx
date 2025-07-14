import FindMyNextMealPage from '@/pages/Recommendations/FindMyNextMeal/FindMyNextMeal'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/recommendations/find-meal/')({
  component: FindMyNextMealPage,
})


