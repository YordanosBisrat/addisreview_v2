import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import './AuthPage.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      showToast('Account created! You are now logged in.', 'success');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <form className="auth-card card" onSubmit={handleSubmit} noValidate>
          <span className="section-eyebrow">
            <span className="auth-card__brand">
              <span className="auth-card__brand-accent">አዲስ</span>Review
            </span>
          </span>
          <h1>Create an Account</h1>
          <p className="text-secondary">
            Create an account to share your experiences with businesses across Addis Ababa.
          </p>

          <div className="auth-card__field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              autoComplete="name"
              maxLength={80}
              required
            />
          </div>

          <div className="auth-card__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-card__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="auth-card__error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="auth-card__switch text-secondary">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}