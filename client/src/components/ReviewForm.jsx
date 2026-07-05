import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import StarRating from './StarRating';
import { submitReview } from '../services/reviewService';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import './ReviewForm.css';

const INITIAL_STATE = { rating: 0, comment: '' };

export default function ReviewForm({ businessId, onReviewSubmitted }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Reviews require an account - this is what fixes the "anyone can post
  // as anyone" gap: the author is always the logged-in user, never a
  // free-text name typed into the form.
  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--locked card">
        <h3>Write a review</h3>
        <p className="text-secondary">You need an account to write a review.</p>
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="btn btn-primary review-form__login-btn"
        >
          <FaSignInAlt /> Log In to Review
        </Link>
        <p className="review-form__switch text-secondary">
          New here? <Link to="/register" state={{ from: location.pathname }}>Create an account</Link>
        </p>
      </div>
    );
  }

  function validate() {
    const next = {};
    if (!form.rating) next.rating = 'Please select a rating.';
    if (!form.comment.trim()) next.comment = 'Please share a comment.';
    else if (form.comment.trim().length > 1000) next.comment = 'Comment is too long.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const review = await submitReview(businessId, form);
      onReviewSubmitted(review);
      setForm(INITIAL_STATE);
      setErrors({});
      showToast('Your review was posted. Thank you!', 'success');
    } catch (err) {
      showToast(err.message || 'Could not submit your review.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="review-form card" onSubmit={handleSubmit} noValidate>
      <h3>Write a review</h3>
      <p className="review-form__as text-secondary">
        Posting as <strong>{user.name}</strong>
      </p>

      <div className="review-form__field">
        <label>Rating</label>
        <StarRating
          value={form.rating}
          interactive
          onChange={(rating) => setForm((f) => ({ ...f, rating }))}
          size={26}
        />
        {errors.rating && <span className="review-form__error">{errors.rating}</span>}
      </div>

      <div className="review-form__field">
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          rows={4}
          value={form.comment}
          onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
          placeholder="Share details about your experience..."
          maxLength={1000}
        />
        {errors.comment && <span className="review-form__error">{errors.comment}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Posting...' : 'Submit Review'}
      </button>
    </form>
  );
}
