/**
 * jsdom-safe mock for `motion/react` used in vitest.
 * AnimatePresence + springs can spin forever inside jsdom's rAF-free timer
 * environment; test renders use plain elements instead (visuals don't matter here).
 */
import React from 'react';
import { vi } from 'vitest';

vi.mock('motion/react', () => {
  const passthrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  return {
    motion: new Proxy({}, {
      get: (_t, _prop) =>
        React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>>(
          ({ children, ...rest }, ref) => {
            const { initial, animate, exit, transition, whileHover, whileTap, layoutId, ...html } =
              rest as Record<string, unknown> & { children?: React.ReactNode };
            return React.createElement('div', { ...html, ref }, children as React.ReactNode);
          }
        ),
    }),
    AnimatePresence: passthrough,
    LayoutGroup: passthrough,
    useReducedMotion: () => true,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
  };
});
