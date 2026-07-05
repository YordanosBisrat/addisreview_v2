import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

// Shorter default placeholder so it doesn't get clipped mid-word inside
// the hero search input on smaller viewports (see SearchBar.css for the
// accompanying max-width bump + ellipsis fallback).
export default function SearchBar({ placeholder = 'Search businesses' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form className="hero-search" onSubmit={handleSubmit}>
      <FaSearch className="hero-search__icon" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search businesses"
      />
      <button type="submit" className="btn btn-primary hero-search__btn">
        Search
      </button>
    </form>
  );
}