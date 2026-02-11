import { Suspense } from 'react';
import { captureException } from '@sentry/nextjs';

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
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      const isNextInternalError =
        ('digest' in errorObj &&
          typeof errorObj.digest === 'string' &&
          errorObj.digest.startsWith('NEXT_')) ||
        errorObj.message?.includes('searchParams') ||
        errorObj.message?.includes('dynamic-server-error');

      if (isNextInternalError) {
        throw errorObj;
      }

      captureException(errorObj);
      console.error('ErrorBoundary Error:', errorObj);
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
