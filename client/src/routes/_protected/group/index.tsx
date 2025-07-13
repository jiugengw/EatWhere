import { ViewGroupsPage } from '@/pages/Group/ViewGroups/ViewGroups';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/group/')({
  component: ViewGroupsPage,
});
