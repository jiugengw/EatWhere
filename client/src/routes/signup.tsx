import { createFileRoute } from '@tanstack/react-router';
import { SignupPage } from '../pages/auth/SignupPage/SignupPage';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});
