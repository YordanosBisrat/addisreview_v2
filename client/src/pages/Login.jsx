import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import './AuthPage.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      showToast('Welcome back!', 'success');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not log in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <form className="auth-card card" onSubmit={handleSubmit} noValidate>
          <span className="section-eyebrow">Welcome back</span>
          <h1>Log In</h1>

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
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="auth-card__error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
          </button>

          <p className="auth-card__switch text-secondary">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>

          
        </form>
      </div>
    </div>
  );
}
