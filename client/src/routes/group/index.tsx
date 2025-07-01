import { ViewGroupsPage } from '@/pages/Group/ViewGroups/ViewGroups';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/group/')({
  component: ViewGroupsPage,
});
