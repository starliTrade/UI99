// Vitest matcher augmentation for the axe matcher registered in src/test/setup.ts
import 'vitest';

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): void;
  }
}
