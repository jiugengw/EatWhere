import { SuggestRestaurantsPage } from '@/pages/Recommendations/SuggestMeal/SuggestRestaurants'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/recommendations/find-meal/suggest',
)({
  component: SuggestRestaurantsPage,
})

