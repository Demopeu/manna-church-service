export function extractVideoId(url: string | undefined): string | null {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
  );
  if (youtubeMatch?.[1]) {
    return youtubeMatch[1];
  }

  const instaMatch = url.match(/instagram\.com\/reels?\/([^/?#&]+)/);
  if (instaMatch?.[1]) {
    return instaMatch[1];
  }

  return null;
}
