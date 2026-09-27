/**
 * UI99 — Root Error Boundary
 *
 * Last-resort safety net for the entire provider tree: a render/runtime crash
 * anywhere shows a themed recovery screen (with error message + reload) instead
 * of an unstyled blank page. Matched to the Obsidian Dark tokens — no hard-coded
 * colors outside the established system values.
 */

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface to console so preview diagnostics / remote debugging can see it.
    console.error('[UI99] Unhandled render error:', error, info.componentStack);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      /* nothing else to do */
    }
  };

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div
          dir="ltr"
          className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--bg-canvas) px-6 text-center text-(--text-primary)"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              aria-hidden="true"
              className="h-12 w-12 rounded-full border border-(--border-hairline) bg-(--bg-card) shadow-(--shadow-card)"
            />
            <h1 className="text-xl font-semibold tracking-tight">UI99 hit an unexpected error</h1>
            <p className="max-w-md text-sm leading-relaxed text-(--text-secondary)">
              The app crashed while rendering. Your data is safe — reload to try again.
            </p>
          </div>
          <pre
            className="max-w-xl overflow-auto rounded-xl border border-(--border-hairline) bg-(--bg-card) p-4 text-left font-mono text-xs text-(--text-secondary)"
            role="alert"
          >
            {error.message || String(error)}
          </pre>
          {/* The one control on this screen, and it wears the resting surface
              like every other control in the system (§2.6) — the crash page is
              the first thing a user ever sees of it. */}
          <button
            type="button"
            onClick={this.handleReload}
            className="min-h-[44px] rounded-full border border-(--border-soft) bg-(--bg-control) px-6 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--state-hover) focus-visible:outline-none focus-ui99"
          >
            Reload UI99
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
