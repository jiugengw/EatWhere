import { RecommendationsPage } from '@/pages/Recommendations/Recommendations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recommendations/')({
    component: RecommendationsPage,
});