import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from '@mantine/modals';
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";

import { AuthProvider } from "./context/auth-context";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/auth/useAuth";
import type { AuthContextType } from "./context/auth-context";

interface RouterContext {
  auth: AuthContextType;
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: undefined as any as RouterContext, 
});

const queryClient = new QueryClient();

const theme = createTheme({
  colors: {
    primary: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ],
  },
  primaryColor: 'primary',
  other: {
    darkBackground: '#1a1b1e',
    darkSurface: '#25262b',
    darkBorder: '#373a40',
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <StrictMode>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <InnerApp />
            </AuthProvider>
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </StrictMode>
  );
}

function InnerApp() {
  const auth = useAuth(); 
  return (
    <RouterProvider 
      router={router} 
      context={{ auth }} 
    />
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}