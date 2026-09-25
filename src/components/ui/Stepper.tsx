/**
 * UI99 — Stepper (Wave C)
 * Multi-step progress indicator (Linear/Onboarding pattern): completed /
 * current / upcoming states, connector hairlines, aria-current="step".
 */

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StepperProps extends React.ComponentProps<'ol'> {
  steps: string[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
}

export function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  className = '',
  ...props
}: StepperProps) {
  return (
    <ol
      className={cn(
        'flex gap-0',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const isDone = i < current;
        const isCurrent = i === current;
        return (
          <li
            key={step}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'flex items-center',
              orientation === 'horizontal' ? 'flex-1 last:flex-none' : 'gap-3 pb-4 last:pb-0'
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-bold transition-all duration-200',
                isDone &&
                  'bg-emerald-500 text-white border-emerald-500 shadow-(var(--glow-accent-md))',
                isCurrent &&
                  'bg-zinc-900 text-white border-zinc-900 dark:bg-(--text-primary) dark:text-(--text-on-fill) dark:border-(--text-primary) ring-4 ring-black/[0.04] dark:ring-white/[0.06]',
                !isDone && !isCurrent &&
                  'bg-transparent text-zinc-400 border-(--border-strong)'
              )}
            >
              {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                'text-xs font-medium tracking-tight',
                orientation === 'horizontal' ? 'ml-2 hidden sm:block' : '',
                isCurrent
                  ? 'text-zinc-950 dark:text-white font-semibold'
                  : 'text-(--text-secondary)'
              )}
            >
              {step}
            </span>
            {orientation === 'horizontal' && i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'mx-3 h-px flex-1 transition-colors duration-200',
                  i < current ? 'bg-emerald-500/50' : 'bg-black/[0.08] dark:bg-white/[0.08]'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
