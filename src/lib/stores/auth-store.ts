'use client';

import { create } from 'zustand';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isAdmin: boolean;
  isKid: boolean;
  accentColor: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profiles: UserProfile[];
  login: (name: string, password: string) => Promise<void>;
  signup: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  switchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) => Promise<void>;
  checkSession: () => void;
}

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )session_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie =
    'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  profiles: [],

  login: async (name: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      const user: UserProfile = {
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar || '',
        bio: data.user.bio || '',
        isAdmin: data.user.isAdmin || false,
        isKid: data.user.isKid || false,
        accentColor: data.user.accentColor || data.user.settings?.accentColor || 'purple',
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (name: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Signup failed' }));
        throw new Error(data.error || 'Signup failed');
      }

      const data = await res.json();
      const user: UserProfile = {
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar || '',
        bio: '',
        isAdmin: data.user.isAdmin || false,
        isKid: data.user.isKid || false,
        accentColor: data.user.accentColor || 'purple',
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      // ignore network errors on logout
    }
    deleteToken();
    set({ user: null, isAuthenticated: false, profiles: [] });
  },

  fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/profiles', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        set({ isLoading: false });
        return;
      }

      const data = await res.json();
      const profiles: UserProfile[] = (data.profiles || []).map(
        (p: { id: string; name: string; avatar?: string; isAdmin?: boolean; isKid?: boolean; accentColor?: string }) => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar || '',
          bio: '',
          isAdmin: p.isAdmin || false,
          isKid: p.isKid || false,
          accentColor: p.accentColor || 'purple',
        }),
      );

      set({ profiles, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  switchProfile: async (userId: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/switch-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Switch failed' }));
        throw new Error(data.error || 'Switch failed');
      }

      const data = await res.json();
      const user: UserProfile = {
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar || '',
        bio: data.user.bio || '',
        isAdmin: data.user.isAdmin || false,
        isKid: data.user.isKid || false,
        accentColor: data.user.accentColor || data.user.settings?.accentColor || 'purple',
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data: { name?: string; bio?: string; avatar?: string }) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Update failed' }));
        throw new Error(err.error || 'Update failed');
      }

      const result = await res.json();
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            name: result.user.name ?? currentUser.name,
            bio: result.user.bio ?? currentUser.bio,
            avatar: result.user.avatar ?? currentUser.avatar,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  },

  checkSession: () => {
    const token = getToken();
    if (token) {
      // Validate session with server
      fetch('/api/auth/profiles', {
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Session invalid');
        })
        .then(data => {
          const profiles: UserProfile[] = (data.profiles || []).map(
            (p: { id: string; name: string; avatar?: string; isAdmin?: boolean; isKid?: boolean; accentColor?: string }) => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar || '',
              bio: '',
              isAdmin: p.isAdmin || false,
              isKid: p.isKid || false,
              accentColor: p.accentColor || 'purple',
            }),
          );
          // Find current user from profiles
          const current = profiles.find(p => p.id === token);
          if (current) {
            set({ user: current, isAuthenticated: true, profiles });
          } else if (profiles.length > 0) {
            set({ user: profiles[0], isAuthenticated: true, profiles });
          }
        })
        .catch(() => {
          deleteToken();
        });
    }
  },
}));

export type { UserProfile };
