import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/pages/User/UserProfile/UserProfile';

export const Route = createFileRoute('/_protected/profile')({
  component: ProfilePage,
});
