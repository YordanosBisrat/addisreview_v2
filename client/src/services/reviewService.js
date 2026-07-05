import api from './api';

/**
 * Fetch a page of reviews for a business.
 * Returns { reviews, pagination } where pagination has { page, limit, total, totalPages }.
 */
export async function getReviews(businessId, { page = 1, limit = 5 } = {}) {
  const { data } = await api.get(`/businesses/${businessId}/reviews`, {
    params: { page, limit },
  });
  return { reviews: data.data, pagination: data.pagination };
}

/**
 * Submit a new review for a business. Requires the user to be logged in -
 * the author is derived server-side from the JWT, so payload only needs
 * the actual review content.
 * payload: { rating, comment }
 */
export async function submitReview(businessId, payload) {
  const { data } = await api.post(`/businesses/${businessId}/reviews`, payload);
  return data.data;
}
