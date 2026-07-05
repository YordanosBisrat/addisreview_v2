import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaMapMarkedAlt, FaStar, FaUsers } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import BusinessCard from '../components/BusinessCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import { getCategories } from '../services/categoryService';
import { getBusinesses } from '../services/businessService';
import './Home.css';

// How long each hero background photo stays up before crossfading to the next
const SLIDE_DURATION_MS = 5500;

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalBusinesses, setTotalBusinesses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, businessesResult] = await Promise.all([
        getCategories(),
        getBusinesses({ limit: 30 }),
      ]);
      setCategories(categoriesData);
      setTotalBusinesses(businessesResult.pagination.total);

      const businesses = businessesResult.businesses;

      // "Featured" = top 6 businesses by average rating
      const sorted = [...businesses].sort((a, b) => b.average_rating - a.average_rating);
      const topSix = sorted.slice(0, 6);
      setFeatured(topSix);

      // Hero background now rotates through the SAME curated top 6 used
      // for "Featured Businesses" below, instead of all 30 fetched
      // businesses. A slideshow cycling through the entire catalog reads
      // as "we had the data so we used it," not a deliberate choice - and
      // it competed for attention with the search bar sitting on top of
      // it. Reusing topSix also means there's only one "which businesses
      // are we highlighting" concept in this component, not two.
      setSlides(
        topSix.map((b) => ({
          id: b.id,
          image: b.image_url,
          category: b.category_name,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Advance the hero slideshow on a timer once slides are loaded. Depends
  // on slides.length (not the array itself) so the interval isn't torn
  // down and rebuilt on every render.
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeCategory = slides[activeSlide]?.category;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__background" aria-hidden="true">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero__slide ${index === activeSlide ? 'is-active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="hero__overlay" />
        </div>

        {activeCategory && (
          <span key={activeSlide} className="hero__category-badge">
            {activeCategory}
          </span>
        )}

        <div className="container hero__inner">
          <span className="section-eyebrow">Ethiopian Business Reviews</span>
          <h1 className="hero__title">
            Discover businesses
            <br />
            Share your experience
          </h1>

          <SearchBar />

          <div className="hero__stats">
            <div className="hero__stat">
              <FaMapMarkedAlt />
              <span>{totalBusinesses ?? '—'}+ Businesses</span>
            </div>
            <div className="hero__stat">
              <FaStar />
              <span>Verified Ratings</span>
            </div>
            <div className="hero__stat">
              <FaUsers />
              <span>Real Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {!error && (
        <>
          {/* Categories */}
          <section className="section">
            <div className="container">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">Browse</span>
                  <h2>Categories</h2>
                </div>
              </div>
              {loading ? (
                <SkeletonGrid count={5} variant="category" gridClassName="grid-categories" />
              ) : (
                <div className="grid grid-categories">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Featured Businesses */}
          <section className="section section--muted">
            <div className="container">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">Top Rated</span>
                  <h2>Featured Businesses</h2>
                </div>
                <Link to="/search" className="section-heading__link">
                  View all <FaArrowRight />
                </Link>
              </div>
              {loading ? (
                <SkeletonGrid count={6} variant="business" gridClassName="grid-businesses" />
              ) : (
                <div className="grid grid-businesses">
                  {featured.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}