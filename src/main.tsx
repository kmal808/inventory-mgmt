import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { SupabaseProvider } from './context';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
      <Toaster position="top-right" />
    </SupabaseProvider>
  </StrictMode>
);