import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="container not-found__inner">
        <FaCompass className="not-found__icon" />
        <h1>404</h1>
        <h2>Page not found</h2>
        <p className="text-secondary">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
