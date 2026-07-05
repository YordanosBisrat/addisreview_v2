import api from './api';


export async function getBusinesses({ categoryId, page = 1, limit = 12 } = {}) {
  const params = { page, limit };
  if (categoryId) params.category = categoryId;
  const { data } = await api.get('/businesses', { params });
  return { businesses: data.data, pagination: data.pagination };
}


export async function getBusinessById(id) {
  const { data } = await api.get(`/businesses/${id}`);
  return data.data;
}


export async function searchBusinesses(query, { page = 1, limit = 12 } = {}) {
  const { data } = await api.get('/search', { params: { q: query, page, limit } });
  return { businesses: data.data, pagination: data.pagination };
}
