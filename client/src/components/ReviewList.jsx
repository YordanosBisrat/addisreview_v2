import StarRating from './StarRating';
import EmptyState from './EmptyState';
import { formatDate, getInitials } from '../utils/formatters';
import { FaCommentAlt } from 'react-icons/fa';
import './ReviewList.css';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={FaCommentAlt}
        title="No reviews yet"
        message="Be the first to share your experience with this business."
      />
    );
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-list__item card">
          <div className="review-list__avatar" aria-hidden="true">
            {getInitials(review.author_name)}
          </div>
          <div className="review-list__content">
            <div className="review-list__header">
              <span className="review-list__author">{review.author_name}</span>
              <span className="review-list__date text-secondary">{formatDate(review.created_at)}</span>
            </div>
            <StarRating value={review.rating} size={14} />
            <p className="review-list__comment">{review.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
