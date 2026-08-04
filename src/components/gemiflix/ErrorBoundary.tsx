'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app-store';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/* ============================================================
   ErrorBoundary — class component for catching render errors
   ============================================================ */
class ErrorBoundaryInner extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

/* ============================================================
   Glass-styled error fallback (function component for hooks)
   ============================================================ */
function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const setView = useAppStore((s) => s.setView);

  const handleGoHome = () => {
    setView('dashboard');
    onRetry();
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="glass-deep flex max-w-md flex-col items-center gap-5 p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10"
        >
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xl font-semibold text-white"
        >
          Something went wrong
        </motion.h2>

        {/* Error message */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-panel max-h-32 w-full overflow-y-auto rounded-lg p-3 text-sm text-[var(--muted-foreground)]"
        >
          {error?.message ?? 'An unexpected error occurred.'}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <Button
            onClick={handleGoHome}
            className="glass-button-shine gap-2 rounded-xl bg-white/5 text-white hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            onClick={onRetry}
            variant="outline"
            className="glass-button-shine gap-2 rounded-xl border-white/10 text-white hover:bg-white/5"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ErrorBoundaryInner;
