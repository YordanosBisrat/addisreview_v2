import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import BusinessCard from '../components/BusinessCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import LoadMoreButton from '../components/LoadMoreButton';
import { getBusinesses, searchBusinesses } from '../services/businessService';
import './ListPage.css';

const PAGE_SIZE = 9;

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = query.trim()
        ? await searchBusinesses(query.trim(), { page: 1, limit: PAGE_SIZE })
        : await getBusinesses({ page: 1, limit: PAGE_SIZE });
      setResults(result.businesses);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [loadData]);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue.trim() !== query.trim()) {
        setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {});
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  async function handleLoadMore() {
    if (!pagination) return;
    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const result = query.trim()
        ? await searchBusinesses(query.trim(), { page: nextPage, limit: PAGE_SIZE })
        : await getBusinesses({ page: nextPage, limit: PAGE_SIZE });
      setResults((current) => [...current, ...result.businesses]);
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
            <span className="section-eyebrow">{query ? 'Search Results' : 'All Businesses'}</span>
            <h1>{query ? `Results for "${query}"` : 'All Businesses'}</h1>
          </div>
        </div>

        <div className="list-page__search">
          <FaSearch />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search businesses or categories..."
            aria-label="Search businesses"
          />
        </div>

        {loading && <SkeletonGrid count={6} variant="business" />}
        {error && <ErrorMessage message={error} onRetry={loadData} />}

        {!loading && !error && results.length === 0 && (
          <EmptyState
            icon={FaSearch}
            title="No results found"
            message={`We couldn't find any businesses matching "${query}". Try a different search term.`}
          />
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="grid grid-businesses">
              {results.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
            <LoadMoreButton
              onClick={handleLoadMore}
              loading={loadingMore}
              hasMore={hasMore}
              total={pagination?.total}
              shown={results.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
