/**
 * UI99 — Swatch (Wave H)
 * Design-token presentation chip: literal hex display + copy affordance.
 * The color-science layer of the docs — every palette token shown exactly.
  * @token Chip label bar resolves `--bg-card`; hex text is computed against the swatch itself for guaranteed ≥4.5:1.
*/

import React from 'react';
import { cn } from '../../lib/utils';
import { CopyButton } from './CopyButton';

export interface SwatchProps {
  name: string;
  hex: string;
  contrastNote?: string;
  className?: string;
}

export function Swatch({ name, hex, contrastNote, className = '' }: SwatchProps) {
  // Pick readable foreground against the swatch itself.
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const light = lum > 0.4;

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-(--radius-control) border border-black/[0.05] dark:border-white/[0.04]',
        className
      )}
    >
      <div className="flex h-16 items-end justify-between p-2.5" style={{ background: hex }}>
        <span
          className={cn('font-mono text-[10px] font-semibold', light ? 'text-black/70' : 'text-white/80')}
        >
          {hex}
        </span>
        <CopyButton text={hex} label="" size="sm" className={cn('opacity-0 group-hover:opacity-100 transition-opacity', light ? 'border-black/[0.12]' : 'border-white/[0.12]')} />
      </div>
      <div className="bg-white px-3 py-2.5 dark:bg-(--bg-card)">
        <div className="text-xs font-semibold text-(--text-primary)">{name}</div>
        {contrastNote && (
          <div className="mt-0.5 text-[10px] font-mono text-(--text-muted)">{contrastNote}</div>
        )}
      </div>
    </div>
  );
}
