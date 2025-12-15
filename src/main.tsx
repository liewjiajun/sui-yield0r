import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SuiProvider } from './providers/SuiProvider';
import './index.css';
import '@mysten/dapp-kit/dist/index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SuiProvider>
        <App />
      </SuiProvider>
    </BrowserRouter>
  </StrictMode>
);
