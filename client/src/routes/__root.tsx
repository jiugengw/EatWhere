import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Layout } from '@/layout/Layout';
import { NotFoundPage } from '@/pages/NotFound/NotFound';
import type { AuthContextType } from '@/context/auth-context';

interface RouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Layout>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  ),
  notFoundComponent: NotFoundPage,
});