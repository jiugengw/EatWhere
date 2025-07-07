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

// Create a new router instance
const router = createRouter({ routeTree });

const queryClient = new QueryClient();

const theme = createTheme({
  colorScheme: 'auto', 
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

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </StrictMode>
  );
}
