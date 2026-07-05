import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

export default function StarRating({
  value = 0,
  onChange,
  interactive = false,
  size = 18,
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = interactive && hoverValue ? hoverValue : value;

  if (!interactive) {
    return (
      <div
        className="star-rating"
        role="img"
        aria-label={`Rated ${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-rating__star ${star <= Math.round(value) ? 'is-filled' : ''}`}
            style={{ fontSize: size }}
          >
            <FaStar />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="star-rating star-rating--interactive"
      role="radiogroup"
      aria-label="Select a rating from 1 to 5 stars"
      onMouseLeave={() => setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayValue);
        const selected = star === value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className={`star-rating__star ${filled ? 'is-filled' : ''}`}
            style={{ fontSize: size }}
            onMouseEnter={() => setHoverValue(star)}
            onFocus={() => setHoverValue(star)}
            onClick={() => onChange?.(star)}
          >
            <FaStar />
          </button>
        );
      })}
    </div>
  );
}
