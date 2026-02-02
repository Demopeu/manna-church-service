import * as Sentry from '@sentry/nextjs';

const BUCKET_NAME = 'bulletins';

export function extractBucketPath(
  url: string,
  fallbackFolder: 'pages' | 'covers',
): string | null {
  try {
    const fileUrl = new URL(url);
    const bucketPath = fileUrl.pathname.split(`/${BUCKET_NAME}/`)[1];
    if (bucketPath) {
      return decodeURIComponent(bucketPath);
    }
  } catch (error) {
    Sentry.captureException(error);
    const fileName = url.split('/').pop();
    if (fileName) {
      return `${fallbackFolder}/${fileName}`;
    }
  }
  return null;
}

export function extractBucketPaths(
  urls: string[],
  fallbackFolder: 'pages' | 'covers',
): string[] {
  return urls
    .map((url) => extractBucketPath(url, fallbackFolder))
    .filter((path): path is string => path !== null);
}
