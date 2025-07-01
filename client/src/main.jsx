import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';
import './index.css';
import { AuthProvider } from './shared/context/auth-context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);
