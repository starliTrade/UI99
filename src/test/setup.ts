import '@testing-library/jest-dom/vitest';
import './motionMock';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import type { AxeResults } from 'axe-core';

// jest-axe's matcher is Jest-coupled; register a vitest-native equivalent.
expect.extend({
  toHaveNoViolations(received: { violations: AxeResults['violations'] }) {
    const violations = received?.violations ?? [];
    const pass = violations.length === 0;
    const summary = violations
      .map((v) => `  - [${v.id}] ${v.help} (${v.nodes.length} node(s))`)
      .join('\n');
    return {
      pass,
      message: () =>
        pass
          ? 'Expected axe violations but none were found'
          : `axe-core found ${violations.length} violation(s):\n${summary}`,
    };
  },
});

// jsdom lacks ResizeObserver (required by cmdk/Radix)
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as Record<string, unknown>).ResizeObserver =
  (globalThis as Record<string, unknown>).ResizeObserver ?? ResizeObserverStub;

// jsdom lacks scrollIntoView (required by cmdk selected item)
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});

afterEach(() => {
  cleanup();
});
