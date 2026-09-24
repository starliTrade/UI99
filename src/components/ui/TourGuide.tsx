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
      className={cn(
        'w-full max-w-sm p-4 rounded-2xl bg-white dark:bg-[#131318] border border-black/10 dark:border-white/[0.06]',
        'shadow-[0_20px_48px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in zoom-in-95',
        className
      )}
    >
      {/* Header with step pill & close */}
      <div className="flex items-center justify-between pb-3">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
          Step {currentStep + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Step Content */}
      <div className="flex flex-col gap-1.5 pb-4">
        <h5 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {step.title}
        </h5>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Step Indicators & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
        {/* Progress Dots */}
        <div className="flex items-center gap-1">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
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
            <Button size="xs" variant="ghost" onClick={prev}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            size="xs"
            variant="primary"
            onClick={next}
            className="text-xs px-3"
          >
            <span>{isLast ? 'Finish' : 'Next'}</span>
            {isLast ? (
              <Check className="w-3 h-3 ml-1" />
            ) : (
              <ChevronRight className="w-3 h-3 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
