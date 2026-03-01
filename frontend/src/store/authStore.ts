import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'ADMIN';
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.data, isAuthenticated: true });
  },

  register: async (name, email, phone, password, confirmPassword) => {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    set({ user: data.data, isAuthenticated: true });
  },

  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
