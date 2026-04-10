'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FitGlass error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-semibold text-fg-text">Something went wrong</p>
          <p className="text-sm text-fg-text-soft">An unexpected error occurred.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-fg-accent px-4 py-2 text-sm font-medium text-white"
            data-cursor="interactive"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
