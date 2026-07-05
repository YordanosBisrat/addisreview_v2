import api from './api';

/**
 * Fetch all categories with their business counts.
 */
export async function getCategories() {
  const { data } = await api.get('/categories');
  return data.data;
}
