/**
 * Resolve image URL to a full absolute URL.
 *
 * - Paths starting with `/uploads/` → prepend backend origin
 * - Paths starting with `/images/` → keep as-is (served from public/)
 * - Full URLs (http/https) → keep as-is
 * - Fallback → return empty string
 */
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5010';

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Uploaded files on the backend
  if (url.startsWith('/uploads/')) {
    return `${API_ORIGIN}${url}`;
  }

  // Static files in frontend/public (like /images/banners/banner1.svg)
  return url;
}
