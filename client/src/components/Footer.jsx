import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaPaperPlane,
} from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  // NOTE: there's no real subscribe endpoint yet - this confirms interest
  // and gives the user feedback, but doesn't persist the email anywhere.
  // Wire this up to a real POST /api/subscribe (or similar) when one exists.
  function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    showToast("Thanks! We'll keep you posted on new spots.", 'success');
    setEmail('');
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-accent">አዲስ</span>Review
          </Link>
          <p className="footer__tagline">
            Real reviews from real people across Addis Ababa.
          </p>
        </div>

        <div className="footer__links">
          {/* Restored - the newsletter column swap earlier had dropped
              the site's only footer navigation entirely. */}
          <div className="footer__col footer__col--explore">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/search">All Businesses</Link>
          </div>

          
          <div className="footer__col footer__col--contact">
            <h4>Contact</h4>
            <span className="footer__contact-item">
              <FaMapMarkerAlt aria-hidden="true" /> Addis Ababa, Ethiopia
            </span>
            <a href="mailto:adisreview@gmail.com" className="footer__contact-item">
              <FaEnvelope aria-hidden="true" /> adisreview@gmail.com
            </a>
            <a href="tel:+251115000000" className="footer__contact-item">
              <FaPhoneAlt aria-hidden="true" /> +251 11 500 0000
            </a>
          </div>

          <div className="footer__col footer__col--newsletter">
            <h4>Stay Updated</h4>
            <p className="footer__newsletter-copy">Get updates on new spots.</p>
            <form className="footer__newsletter" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                required
              />
              <button type="submit" className="footer__newsletter-btn" aria-label="Subscribe">
                <FaPaperPlane />
              </button>
            </form>
          </div>


          <div className="footer__col footer__col--social">
            <h4>Follow Us</h4>
            <div className="footer__social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">
                <FaTelegramPlane />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {year} አዲስReview. All rights reserved.</p>
      </div>
    </footer>
  );
}