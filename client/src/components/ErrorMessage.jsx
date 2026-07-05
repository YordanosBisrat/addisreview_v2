import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorMessage.css';

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-message">
      <FaExclamationTriangle className="error-message__icon" />
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
