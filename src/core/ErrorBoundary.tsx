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
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#06070A] px-6 text-center text-[#EDEDEF]"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              aria-hidden="true"
              className="h-12 w-12 rounded-full border border-white/[0.025] bg-[#0B0C11] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_18px_40px_-10px_rgba(0,0,0,0.65)]"
            />
            <h1 className="text-xl font-semibold tracking-tight">UI99 hit an unexpected error</h1>
            <p className="max-w-md text-sm leading-relaxed text-[#92929B]">
              The app crashed while rendering. Your data is safe — reload to try again.
            </p>
          </div>
          <pre
            className="max-w-xl overflow-auto rounded-xl border border-white/[0.025] bg-[#0B0C11] p-4 text-left font-mono text-xs text-[#8E8E98]"
            role="alert"
          >
            {error.message || String(error)}
          </pre>
          <button
            type="button"
            onClick={this.handleReload}
            className="min-h-[44px] rounded-full border border-white/[0.025] bg-[#0E0E14]/75 px-6 text-sm font-medium text-[#EDEDEF] backdrop-blur-xl transition-colors hover:bg-[#131318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070A]"
          >
            Reload UI99
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
