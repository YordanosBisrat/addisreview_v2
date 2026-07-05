import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  const firstName = user?.name?.split(' ')[0];

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-accent">አዲስ</span>Review
        </Link>

      

        <nav className={`navbar__links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>

          {isAuthenticated ? (
            <div className="navbar__account">
              <span className="navbar__account-name">
                <FaUserCircle aria-hidden="true" /> Hi, {firstName}
              </span>
              <button className="navbar__logout" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <div className="navbar__auth-links">
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Log In</NavLink>
              <Link to="/register" className="btn btn-primary navbar__signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      
    </header>
  );
}
