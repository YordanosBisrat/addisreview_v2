import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { TOKEN_STORAGE_KEY } from '../services/api';

const USER_STORAGE_KEY = 'adisreview_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, verify it's still valid by fetching
  // the current user - this catches expired tokens instead of trusting
  // whatever was last cached in localStorage.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getCurrentUser()
      .then((freshUser) => {
        setUser(freshUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {
        // Token expired or invalid - clear the stale session
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function persistSession({ user: freshUser, token }) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
    setUser(freshUser);
  }

  async function login(credentials) {
    const result = await authService.login(credentials);
    persistSession(result);
    return result.user;
  }

  async function register(details) {
    const result = await authService.register(details);
    persistSession(result);
    return result.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
