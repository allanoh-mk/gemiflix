'use client';

import { create } from 'zustand';
import type { Movie } from '@/lib/mock-data';

export interface WatchHistoryItem {
  movieId: string;
  movieTitle: string;
  posterImage?: string;
  posterGradient: string;
  progress: number; /* 0-100 */
  lastWatched: number; /* timestamp */
  duration: number; /* total seconds */
}

const STORAGE_KEY = 'gemiflix-watch-history';
const MAX_ITEMS = 20;

interface WatchHistoryState {
  items: WatchHistoryItem[];
  addToHistory: (movie: Movie, progress: number) => void;
  removeFromHistory: (movieId: string) => void;
  clearHistory: () => void;
}

function loadFromStorage(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchHistoryItem[];
  } catch {
    return [];
  }
}

function persistToStorage(items: WatchHistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full or unavailable */
  }
}

export const useWatchHistoryStore = create<WatchHistoryState>((set, get) => ({
  items: loadFromStorage(),

  addToHistory: (movie: Movie, progress: number) => {
    const { items } = get();
    const clampedProgress = Math.max(0, Math.min(100, progress));

    /* Remove existing entry for same movie */
    const filtered = items.filter((i) => i.movieId !== movie.id);

    const entry: WatchHistoryItem = {
      movieId: movie.id,
      movieTitle: movie.title,
      posterImage: movie.posterImage,
      posterGradient: movie.posterGradient,
      progress: clampedProgress,
      lastWatched: Date.now(),
      duration: movie.duration * 60, /* convert minutes to seconds */
    };

    const updated = [entry, ...filtered]
      .sort((a, b) => b.lastWatched - a.lastWatched)
      .slice(0, MAX_ITEMS);

    set({ items: updated });
    persistToStorage(updated);
  },

  removeFromHistory: (movieId: string) => {
    const { items } = get();
    const updated = items.filter((i) => i.movieId !== movieId);
    set({ items: updated });
    persistToStorage(updated);
  },

  clearHistory: () => {
    set({ items: [] });
    persistToStorage([]);
  },
}));
