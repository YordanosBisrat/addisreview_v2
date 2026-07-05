/**
 * Formats an ISO/SQLite datetime string into a short, human-friendly date
 * such as "Jun 12, 2026".
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns the first letter of each of the first two words in a name,
 * used for avatar initials in the review list.
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '');
  return initials.join('');
}

/**
 * Builds a Google Maps "search" URL for a business, preferring precise
 * coordinates when available and falling back to a text address query.
 */
export function getGoogleMapsUrl({ latitude, longitude, name, address }) {
  if (latitude && longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  const query = encodeURIComponent(`${name}, ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
