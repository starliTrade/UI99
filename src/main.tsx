import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
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
    {/*
      reducedMotion="user" is the kit-wide honouring of WCAG 2.3.3 / the
      `prefers-reduced-motion` contract.

      The CSS block in ui99.css only reaches `transition-duration`. The springs
      in this kit are driven by `motion`, which animates transforms through JS —
      a `transition-duration: 0.01ms !important` does nothing to them. Before
      this wrapper, exactly three components consulted `useReducedMotion`; the
      other ~90 spring-animated ones ignored the setting entirely.

      One provider makes it a property of the *kit* rather than a per-component
      habit, which is the only form a consumer can actually rely on.
    */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
