import { createFileRoute } from '@tanstack/react-router';
import { PreferencesPage } from '@/pages/User/Preferences/Preferences';

export const Route = createFileRoute('/preferences')({
  component: PreferencesPage,
});
