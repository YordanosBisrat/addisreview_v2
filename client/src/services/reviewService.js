import api from './api';


export async function getReviews(businessId, { page = 1, limit = 5 } = {}) {
  const { data } = await api.get(`/businesses/${businessId}/reviews`, {
    params: { page, limit },
  });
  return { reviews: data.data, pagination: data.pagination };
}


export async function submitReview(businessId, payload) {
  const { data } = await api.post(`/businesses/${businessId}/reviews`, payload);
  return data.data;
}
