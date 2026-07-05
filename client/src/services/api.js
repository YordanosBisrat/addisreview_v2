import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const TOKEN_STORAGE_KEY = 'adisreview_token';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;

    if (error.response) {
      message = error.response.data?.error || `Request failed with status ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED') {
      message = 'The request timed out. Please check your connection and try again.';
    } else if (error.request) {
      message = 'Could not reach the server. Please make sure it is running and try again.';
    } else {
      message = error.message || 'Something went wrong. Please try again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
