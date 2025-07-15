import { SearchRestaurantsPage } from '@/pages/SearchRestaurants/SearchRestaurants'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/search')({
    component: SearchRestaurantsPage,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            q: (search.q as string) || '',
        };
    },
})

