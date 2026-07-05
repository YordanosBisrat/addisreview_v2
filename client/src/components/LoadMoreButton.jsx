import './LoadMoreButton.css';

export default function LoadMoreButton({ onClick, loading, hasMore, total, shown }) {
  if (!hasMore) return null;

  return (
    <div className="load-more">
      <button className="btn btn-secondary" onClick={onClick} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
      {typeof total === 'number' && (
        <p className="text-secondary load-more__count">
          Showing {shown} of {total}
        </p>
      )}
    </div>
  );
}
