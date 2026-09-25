/**
 * UI99 — TourGuide Component
 * Interactive product walkthrough and onboarding spotlight card with step pagination.
 */

import React, { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface TourStep {
  title: string;
  description: string;
  badge?: string;
}

export interface TourGuideProps {
  steps: TourStep[];
  onComplete?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function TourGuide({
  steps,
  onComplete,
  onDismiss,
  className,
}: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const next = () => {
    if (isLast) {
      onComplete?.();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  if (!step) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`Product tour, step ${currentStep + 1} of ${steps.length}: ${step.title}`}
      aria-live="polite"
      className={cn(
        'w-full max-w-sm p-4 rounded-(--radius-control) bg-white dark:bg-(--bg-elevated) border border-black/10 dark:border-white/[0.06]',
        'shadow-(--elevation-4) backdrop-blur-xl animate-in fade-in zoom-in-95',
        className
      )}
    >
      {/* Header with step pill & close */}
      <div className="flex items-center justify-between pb-3">
        <span className="type-micro font-mono px-2 py-0.5 rounded-(--radius-pill) bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
          Step {currentStep + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss tour"
          className="p-1 rounded-(--radius-sm) text-(--text-secondary) hover:text-zinc-700 dark:hover:text-white transition-colors"
        >
          <X className="icon-sm" />
        </button>
      </div>

      {/* Step Content */}
      <div className="flex flex-col gap-1.5 pb-4">
        <h5 className="type-body font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="icon-sm text-amber-500" />
          {step.title}
        </h5>
        <p className="type-caption text-(--text-muted) dark:text-zinc-400 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Step Indicators & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
        {/* Progress Dots */}
        <div className="flex items-center gap-1" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={currentStep + 1} aria-label={`Tour progress: step ${currentStep + 1} of ${steps.length}`}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              aria-hidden="true"
              className={cn(
                'h-1.5 rounded-(--radius-pill) transition-all dur-slow',
                idx === currentStep
                  ? 'w-4 bg-zinc-900 dark:bg-white'
                  : 'w-1.5 bg-zinc-300 dark:bg-white/20'
              )}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          {currentStep > 0 && (
            <Button size="xs" variant="ghost" onClick={prev} aria-label="Previous step">
              <ChevronLeft className="icon-sm" />
            </Button>
          )}
          <Button
            size="xs"
            variant="primary"
            onClick={next}
            aria-label={isLast ? 'Finish tour' : 'Next step'}
            className="type-caption px-3"
          >
            <span>{isLast ? 'Finish' : 'Next'}</span>
            {isLast ? (
              <Check className="icon-xs ml-1" />
            ) : (
              <ChevronRight className="icon-xs ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
