import { createFileRoute } from '@tanstack/react-router';
import { SignupPage } from '@/pages/Auth/Signup/Signup';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});
