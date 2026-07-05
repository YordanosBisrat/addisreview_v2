import { FaStar } from 'react-icons/fa';
import './RatingDistribution.css';

export default function RatingDistribution({ distribution, averageRating, reviewCount }) {
  const maxCount = Math.max(1, ...Object.values(distribution));

  return (
    <div className="rating-distribution">
      <div className="rating-distribution__summary">
        <span className="rating-distribution__score">{reviewCount > 0 ? averageRating : '—'}</span>
        <div>
          <div className="rating-distribution__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar key={n} className={n <= Math.round(averageRating) ? 'is-filled' : ''} />
            ))}
          </div>
          <p className="text-secondary">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      <div className="rating-distribution__bars">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const pct = (count / maxCount) * 100;
          return (
            <div className="rating-distribution__row" key={star}>
              <span className="rating-distribution__label">{star} ★</span>
              <div className="rating-distribution__track">
                <div className="rating-distribution__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="rating-distribution__count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
