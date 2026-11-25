import { create } from 'zustand';
import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CITIZEN' | 'EDITOR' | 'REVIEWER' | 'ADMIN';
  locale?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, locale?: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  checkAuth: async () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    const token = localStorage.getItem('nyaya_access_token');

    if (!token) {
      set({ user: null, token: null, isLoading: false });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, token, isLoading: false });
      localStorage.setItem('nyaya_user', JSON.stringify(res.data));
    } catch {
      localStorage.removeItem('nyaya_access_token');
      localStorage.removeItem('nyaya_refresh_token');
      localStorage.removeItem('nyaya_user');
      set({ user: null, token: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data;

    localStorage.setItem('nyaya_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('nyaya_refresh_token', refreshToken);
    }
    localStorage.setItem('nyaya_user', JSON.stringify(user));

    set({ user, token: accessToken, isLoading: false });
    return user;
  },

  register: async (name, email, password, locale = 'en') => {
    const res = await api.post('/auth/register', { name, email, password, locale });
    const { user, accessToken, refreshToken } = res.data;

    localStorage.setItem('nyaya_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('nyaya_refresh_token', refreshToken);
    }
    localStorage.setItem('nyaya_user', JSON.stringify(user));

    set({ user, token: accessToken, isLoading: false });
    return user;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('nyaya_access_token');
      localStorage.removeItem('nyaya_refresh_token');
      localStorage.removeItem('nyaya_user');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
