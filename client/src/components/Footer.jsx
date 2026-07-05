import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-accent">አዲስ</span>Review
          </Link>
          <p className="footer__tagline">
            Discover trusted businesses and share your experience.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
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