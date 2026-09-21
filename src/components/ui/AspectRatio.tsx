/**
 * UI99 — AspectRatio (Wave A)
 * Radix aspect-ratio box for media that must not shift layout while loading.
 */

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

export function AspectRatio({
  ...props
}: React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root {...props} />;
}
AspectRatio.displayName = 'AspectRatio';
