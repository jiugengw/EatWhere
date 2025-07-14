import { SearchRestaurantsPage } from '@/pages/Recommendations/SearchRestaurants/SearchRestaurants';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_protected/recommendations/find-meal/search',
)({
    component: SearchRestaurantsPage,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            q: (search.q as string) || '',
        };
    },
});