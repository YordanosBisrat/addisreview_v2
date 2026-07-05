import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaDirections, FaArrowLeft, FaStar } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RatingDistribution from '../components/RatingDistribution';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import LoadMoreButton from '../components/LoadMoreButton';
import { getBusinessById } from '../services/businessService';
import { getReviews } from '../services/reviewService';
import { getGoogleMapsUrl } from '../utils/formatters';
import './BusinessDetails.css';

const REVIEWS_PAGE_SIZE = 5;

export default function BusinessDetails() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsPagination, setReviewsPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [businessData, reviewsResult] = await Promise.all([
        getBusinessById(id),
        getReviews(id, { page: 1, limit: REVIEWS_PAGE_SIZE }),
      ]);
      setBusiness(businessData);
      setReviews(reviewsResult.reviews);
      setReviewsPagination(reviewsResult.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [loadData]);

  function handleReviewSubmitted(newReview) {
    setReviews((current) => [newReview, ...current]);
    setReviewsPagination((current) =>
      current ? { ...current, total: current.total + 1 } : current
    );
    // Refresh business data so the average rating / distribution stay in sync
    getBusinessById(id).then(setBusiness).catch(() => {});
  }

  async function handleLoadMoreReviews() {
    if (!reviewsPagination) return;
    setLoadingMoreReviews(true);
    try {
      const nextPage = reviewsPagination.page + 1;
      const result = await getReviews(id, { page: nextPage, limit: REVIEWS_PAGE_SIZE });
      setReviews((current) => [...current, ...result.reviews]);
      setReviewsPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMoreReviews(false);
    }
  }

  const hasMoreReviews = reviewsPagination
    ? reviewsPagination.page < reviewsPagination.totalPages
    : false;

  if (loading) return <LoadingSpinner label="Loading business..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (!business) return null;

  return (
    <div className="business-details">
      <div className="container">
        <Link to="/" className="business-details__back">
          <FaArrowLeft /> Back to browsing
        </Link>

        <div className="business-details__hero">
          <img src={business.image_url} alt={business.name} />
        </div>

        <div className="business-details__layout">
          <div className="business-details__main">
            <span className="section-eyebrow">{business.category_name}</span>
            <h1>{business.name}</h1>

            <div className="business-details__meta">
              <span className="business-details__rating">
                <FaStar /> {business.review_count > 0 ? business.average_rating : 'New'}
                <span className="text-secondary">
                  ({business.review_count} {business.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </span>
              <span className="business-details__location text-secondary">
                <FaMapMarkerAlt /> {business.address}
              </span>
            </div>

            <p className="business-details__description">{business.description}</p>

            <a
              className="btn btn-primary"
              href={getGoogleMapsUrl(business)}
              target="_blank"
              rel="noreferrer"
            >
              <FaDirections /> Get Directions
            </a>

            <div className="business-details__section">
              <h2>Ratings &amp; Reviews</h2>
              <RatingDistribution
                distribution={business.rating_distribution}
                averageRating={business.average_rating}
                reviewCount={business.review_count}
              />
            </div>

            <div className="business-details__section">
              <h2>Customer Reviews</h2>
              <ReviewList reviews={reviews} />
              <LoadMoreButton
                onClick={handleLoadMoreReviews}
                loading={loadingMoreReviews}
                hasMore={hasMoreReviews}
                total={reviewsPagination?.total}
                shown={reviews.length}
              />
            </div>
          </div>

          <aside className="business-details__sidebar">
            <ReviewForm businessId={business.id} onReviewSubmitted={handleReviewSubmitted} />
          </aside>
        </div>
      </div>
    </div>
  );
}
