import { ViewRecommendationsPage } from '@/pages/Recommendations/ViewRecommendations/ViewRecommendations';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/recommendations/')({
    component: ViewRecommendationsPage,
});