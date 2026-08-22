import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'OPERATOR' | 'AUDITOR';
  avatar_initials: string;
  created_at?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const STORAGE_KEY_TOKEN = 'openbalancer_auth_token';
const STORAGE_KEY_USER = 'openbalancer_auth_user';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ ok: false, error: 'AuthContext not initialized' }),
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate active session with Backend Edge API on initial load
  const initSession = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Strictly verify token validity against Backend Edge API
      const res = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        } else {
          // Token invalid or expired -> force logout
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          localStorage.removeItem(STORAGE_KEY_USER);
          setUser(null);
        }
      } else {
        // Backend returned non-200 (e.g. 401 Unauthorized) -> force logout
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        setUser(null);
      }
    } catch (err) {
      console.warn('Session verification error:', err);
      // In case of network error, do not trust untrusted session
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    if (!cleanEmail || !cleanPassword) {
      return { ok: false, error: 'Моля, въведете имейл и парола.' };
    }

    try {
      // 100% Backend verification via Cloudflare Edge API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = null;
      }

      if (res.ok && data && data.ok && data.token && data.user) {
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        setUser(data.user);
        return { ok: true };
      } else if (data && data.message) {
        return { ok: false, error: data.message };
      } else {
        return {
          ok: false,
          error: 'Невалиден имейл или парола за операторски достъп.'
        };
      }
    } catch (err: any) {
      return {
        ok: false,
        error: 'Грешка при комуникация със сървъра за автентикация.'
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
