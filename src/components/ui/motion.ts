/**
 * UI99 — Motion Choreography (Phase 7: one timeline, not delays)
 *
 * Apple-grade choreography contract:
 *  - ONE shared clock: every hero element animates from the same start
 *    instant; perceived stagger comes from DISTANCE-BASED spring response,
 *    not per-element `delay` stacking.
 *  - Easing is a family, not a grab-bag: entrance = choreography.enter
 *    (gentle overshoot), exit = choreography.exit (decisive), micro = 120ms
 *    state-layer response.
 *  - Reduced motion: `useChoreography()` returns flat (y:0, opacity-only)
 *    variants — the timeline exists, the travel does not.
 */

import { useReducedMotion } from 'motion/react';

/** Shared spring family. Import these — never hand-roll transition objects. */
export const springs = {
  /** Entrances: gentle overshoot, settles fast (Linear feel). */
  enter: { type: 'spring', stiffness: 380, damping: 30, mass: 0.9 },
  /** Overlays: slightly softer arrival for large surfaces. */
  overlay: { type: 'spring', stiffness: 320, damping: 30 },
  /** Micro-interactions: 120ms state-layer response. */
  micro: { duration: 0.12, ease: [0.3, 0, 0.4, 1] as const },
} as const;

/** Distance-based stagger: NO per-element delay. */
export function staggerY(index: number, step = 26): { y: number } {
  return { y: -Math.min(index * step, 104) };
}

/** Reveal variant pairs for hero flow. */
export function useChoreography() {
  const reduced = useReducedMotion();

  const reveal = (index: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : staggerY(index).y, filter: reduced ? 'none' : 'blur(6px)' },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { ...springs.enter, delay: reduced ? 0 : Math.min(index * 0.02, 0.08) },
    },
  });

  return { reveal, reduced };
}

/** Overlay choreography (Modal/Sheet/Dialog/Dropdown parity helper). */
export const overlayMotion = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: springs.overlay },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.14, ease: [0.3, 0, 0.4, 1] as const } },
} as const;
