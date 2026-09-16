import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'linkedin_distribution_auth';

// Portal credentials (client-side gate for this internal tool)
const ADMIN_ID = 'Linkedin-Admin';
const ADMIN_PASSWORD = 'Linkedin$112';

const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.authenticated && parsed?.userId === ADMIN_ID) {
      return parsed;
    }
  } catch {
    // ignore corrupt session
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => readStoredSession());

  const isAuthenticated = Boolean(session?.authenticated);

  const login = useCallback((userId, password) => {
    const id = String(userId || '').trim();
    const pass = String(password || '');

    if (id === ADMIN_ID && pass === ADMIN_PASSWORD) {
      const next = {
        authenticated: true,
        userId: ADMIN_ID,
        loggedInAt: new Date().toISOString(),
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      setSession(next);
      return { ok: true };
    }

    return { ok: false, error: 'Invalid ID or password. Please try again.' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userId: session?.userId || null,
      login,
      logout,
    }),
    [isAuthenticated, session?.userId, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export default AuthContext;
