import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, unwrap } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'candidate' | 'recruiter';
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem('skillproof_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await unwrap<{ user: User }>(api.get('/auth/me'));
      setUser(user);
    } catch {
      localStorage.removeItem('skillproof_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await unwrap<{ token: string; user: User }>(
      api.post('/auth/login', { email, password })
    );
    localStorage.setItem('skillproof_token', token);
    setUser(user);
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'candidate' | 'recruiter';
  }) {
    const { token, user } = await unwrap<{ token: string; user: User }>(
      api.post('/auth/register', data)
    );
    localStorage.setItem('skillproof_token', token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('skillproof_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
