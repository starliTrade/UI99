/**
 * Single source of truth for the npm kit's runtime dependency list.
 * Consumed by:
 *   - scripts/build-registry.mjs  (registry item `dependencies` scanning)
 *   - scripts/build-kit-manifest.mjs (dist-kit package.json `dependencies`)
 * Keep in sync with the primitives' real imports — CI registry validation
 * catches dangling registry refs, `npm pack --dry-run` catches manifest drift.
 */
export const KIT_RUNTIME_DEPS = [
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'lucide-react',
  'motion',
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-aspect-ratio',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-hover-card',
  '@radix-ui/react-label',
  '@radix-ui/react-menubar',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toggle',
  '@radix-ui/react-toggle-group',
  '@radix-ui/react-tooltip',
  'cmdk',
];
