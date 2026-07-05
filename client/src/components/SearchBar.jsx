import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search for restaurants, cafés, hotels...' }) {
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
