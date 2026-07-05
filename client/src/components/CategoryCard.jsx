import { Link } from 'react-router-dom';
import { memo } from 'react';
import {
  FaUtensils,
  FaMugHot,
  FaHotel,
  FaShoppingBag,
  FaHospital,
  FaCut,
  FaEllipsisH,
  FaStore,
  FaArrowRight,
} from 'react-icons/fa';
import './CategoryCard.css';

const ICON_MAP = {
  FaUtensils,
  FaMugHot,
  FaHotel,
  FaShoppingBag,
  FaHospital,
  FaCut,
  FaEllipsisH,
};

function CategoryCard({ category }) {
  const Icon = ICON_MAP[category.icon] || FaStore;
  const countLabel = `${category.business_count} ${category.business_count === 1 ? 'business' : 'businesses'}`;

  return (
    <Link
      to={`/category/${category.id}`}
      className="category-card card"
      aria-label={`Browse ${category.name}, ${countLabel}`}
    >
      <div className="category-card__icon" aria-hidden="true">
        <Icon />
      </div>
      <h3 className="category-card__name">{category.name}</h3>
      <p className="category-card__count text-secondary">{countLabel}</p>
      <span className="category-card__explore" aria-hidden="true">
        Explore <FaArrowRight />
      </span>
    </Link>
  );
}

export default memo(CategoryCard);
