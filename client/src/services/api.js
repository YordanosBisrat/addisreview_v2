import axios from 'axios';

// In development, Vite proxies "/api" to the Express server (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend's base URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const TOKEN_STORAGE_KEY = 'adisreview_token';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the logged-in user's token (if any) to every outgoing request.
// Reading straight from localStorage here (rather than importing the auth
// context into this plain module) keeps the services layer decoupled from
// React.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalizes errors so every service function throws a plain Error with
// a readable message, regardless of whether the backend responded with
// a structured error, the request timed out, or it never reached the
// server at all (e.g. backend not running, offline).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;

    if (error.response) {
      // Server responded with an error status (4xx/5xx)
      message = error.response.data?.error || `Request failed with status ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED') {
      message = 'The request timed out. Please check your connection and try again.';
    } else if (error.request) {
      // Request was sent but no response was received (server down, network offline, CORS)
      message = 'Could not reach the server. Please make sure it is running and try again.';
    } else {
      message = error.message || 'Something went wrong. Please try again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
