import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle browser extension noise (e.g. MetaMask/wallet provider iframe injections)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      (typeof event.reason.message === 'string' &&
        (event.reason.message.includes('MetaMask') ||
          event.reason.message.includes('User rejected') ||
          event.reason.message.includes('wallet') ||
          event.reason.message.includes('ethereum')))
    ) {
      event.preventDefault();
      console.info('Intercepted extension wallet notice:', event.reason.message);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
