import { Suspense } from 'react';
import * as Sentry from '@sentry/nextjs';

interface BoundaryOptions {
  errorFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function withAsyncBoundary<T extends object>(
  Component: (props: T) => Promise<React.ReactNode>,
  options: BoundaryOptions = {},
) {
  const { errorFallback = null, loadingFallback = null } = options;

  async function ErrorBoundary(props: T) {
    try {
      return await Component(props);
    } catch (error) {
      Sentry.captureException(error);
      console.error('ErrorBoundary Error:', error);
      return <>{errorFallback}</>;
    }
  }
  const WithAsyncBoundary = (props: T) => {
    return (
      <Suspense fallback={loadingFallback}>
        <ErrorBoundary {...props} />
      </Suspense>
    );
  };
  return WithAsyncBoundary;
}
