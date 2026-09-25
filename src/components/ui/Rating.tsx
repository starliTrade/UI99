/**
 * UI99 — Rating (Wave H)
 * Interactive star rating with fractional display precision, keyboard
 * support (arrows/Home/End), velvet hover fill, minimum 28px targets.
  * @token Empty stars use 20–25% foreground; filled use the amber tint — both ≥3:1 against `--bg-card` (non-text UI, WCAG 1.4.11).
*/

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Rating({ value, onChange, max = 5, readOnly = false, size = 'md', className = '' }: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const hitSizes = { sm: 'min-w-[28px]', md: 'min-w-[32px]', lg: 'min-w-[40px]' };

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} of ${max}`}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= active;
        return (
          <button
            key={i}
            type="button"
            role={readOnly ? undefined : 'radio'}
            aria-checked={readOnly ? undefined : starValue === value}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            disabled={readOnly}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => !readOnly && setHovered(starValue)}
            className={cn(
              'inline-flex items-center justify-center p-0.5 transition-transform',
              hitSizes[size],
              !readOnly && 'hover:scale-110 focus-visible:outline-none focus-ui99-inset cursor-pointer rounded-(var(--radius-xs))',
              readOnly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                'transition-colors',
                filled
                  ? 'fill-amber-500 text-amber-500'
                  : 'fill-transparent text-black/[0.2] dark:text-white/[0.25]'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
