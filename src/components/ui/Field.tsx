/**
 * UI99 — Field kit (Wave A)
 * Composable form scaffolding: FormField (label+control+hint+error layout),
 * FormHint, FormError. Works with any control; mirrors shadcn Form
 * ergonomics without react-hook-form lock-in.
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className = '',
  ...props
}: FormFieldProps) {
  const hintId = hint ? `${htmlFor ?? 'field'}-hint` : undefined;
  const errorId = error ? `${htmlFor ?? 'field'}-error` : undefined;
  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor={htmlFor}>
            {label}
            {required && (
              <span className="text-rose-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </Label>
          {hint && (
            <span id={hintId} className="text-[10px] font-mono text-(--text-muted)">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
      {error && (
        <p id={errorId} className="text-xs text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface FormHintProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormHint({ className = '', ...props }: FormHintProps) {
  return <p className={cn('text-xs text-(--text-secondary)', className)} {...props} />;
}

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormError({ className = '', ...props }: FormErrorProps) {
  return (
    <p
      className={cn('text-xs text-rose-500', className)}
      role="alert"
      {...props}
    />
  );
}
