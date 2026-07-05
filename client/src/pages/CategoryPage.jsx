import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaStore } from 'react-icons/fa';
import BusinessCard from '../components/BusinessCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import LoadMoreButton from '../components/LoadMoreButton';
import { getBusinesses } from '../services/businessService';
import { getCategories } from '../services/categoryService';
import './ListPage.css';

const PAGE_SIZE = 9;

export default function CategoryPage() {
  const { id } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [businessesResult, categories] = await Promise.all([
        getBusinesses({ categoryId: id, page: 1, limit: PAGE_SIZE }),
        getCategories(),
      ]);
      setBusinesses(businessesResult.businesses);
      setPagination(businessesResult.pagination);
      setCategory(categories.find((c) => String(c.id) === String(id)) || null);
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

  async function handleLoadMore() {
    if (!pagination) return;
    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const result = await getBusinesses({ categoryId: id, page: nextPage, limit: PAGE_SIZE });
      setBusinesses((current) => [...current, ...result.businesses]);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  return (
    <div className="list-page">
      <div className="container">
        <Link to="/" className="list-page__back">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Category</span>
            <h1>{category ? category.name : 'Businesses'}</h1>
            {category && pagination && (
              <p className="text-secondary">
                {pagination.total} {pagination.total === 1 ? 'business' : 'businesses'} found
              </p>
            )}
          </div>
        </div>

        {loading && <SkeletonGrid count={6} variant="business" />}
        {error && <ErrorMessage message={error} onRetry={loadData} />}

        {!loading && !error && businesses.length === 0 && (
          <EmptyState
            icon={FaStore}
            title="No businesses in this category yet"
            message="Check back soon, or explore other categories from the home page."
          />
        )}

        {!loading && !error && businesses.length > 0 && (
          <>
            <div className="grid grid-businesses">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
            <LoadMoreButton
              onClick={handleLoadMore}
              loading={loadingMore}
              hasMore={hasMore}
              total={pagination?.total}
              shown={businesses.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
