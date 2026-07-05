import './LoadingSpinner.css';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__ring" />
      <span className="loading-spinner__label">{label}</span>
    </div>
  );
}
