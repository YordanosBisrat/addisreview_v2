import { Link } from 'react-router-dom';
import { memo } from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import './BusinessCard.css';

function BusinessCard({ business }) {
  const hasReviews = business.review_count > 0;

  return (
    <Link
      to={`/business/${business.id}`}
      className="business-card card"
      aria-label={`View details for ${business.name}, ${business.category_name}, rated ${
        hasReviews ? business.average_rating : 'not yet rated'
      }`}
    >
      <div className="business-card__image-wrap">
        <img src={business.image_url} alt={business.name} loading="lazy" />
        <span className="business-card__category">{business.category_name}</span>
      </div>

      <div className="business-card__body">
        <div className="business-card__header">
          <h3 className="business-card__name">{business.name}</h3>
          <div className="business-card__rating" aria-hidden="true">
            <FaStar />
            <span>{hasReviews ? business.average_rating : 'New'}</span>
          </div>
        </div>

        <p className="business-card__location text-secondary">
          <FaMapMarkerAlt aria-hidden="true" /> {business.address}
        </p>

        <p className="business-card__description text-secondary">{business.description}</p>

        <span className="btn btn-secondary business-card__cta" aria-hidden="true">
          View Details
        </span>
      </div>
    </Link>
  );
}

export default memo(BusinessCard);
