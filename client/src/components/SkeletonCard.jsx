import './SkeletonCard.css';

/**
 * Lightweight animated placeholder shown while a card grid is loading,
 * so the layout doesn't jump once real content arrives (and it reads
 * as "content is coming" rather than a blank spinner over the page).
 */
export default function SkeletonCard({ variant = 'business' }) {
  if (variant === 'category') {
    return (
      <div className="skeleton-card skeleton-card--category card" aria-hidden="true">
        <div className="skeleton skeleton--icon" />
        <div className="skeleton skeleton--line skeleton--line-short" />
        <div className="skeleton skeleton--line skeleton--line-tiny" />
      </div>
    );
  }

  return (
    <div className="skeleton-card card" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton--line skeleton--line-short" />
        <div className="skeleton skeleton--line skeleton--line-tiny" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--line-medium" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, variant = 'business', gridClassName = 'grid-businesses' }) {
  return (
    <div className={`grid ${gridClassName}`} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}
