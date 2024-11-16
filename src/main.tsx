import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { SupabaseProvider } from './context/SupabaseProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </StrictMode>
);