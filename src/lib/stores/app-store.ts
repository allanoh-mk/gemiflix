import { create } from 'zustand';
import type { Movie } from '@/lib/mock-data';

export type AppView = 'login' | 'dashboard' | 'search' | 'detail' | 'player' | 'settings' | 'settings-page' | 'watchlist' | 'history' | 'stats' | 'actor' | 'quiz';

interface AppState {
  view: AppView;
  selectedMovie: Movie | null;
  searchQuery: string;
  showSettings: boolean;
  searchCache: Record<string, Movie[]>;
  viewHistory: AppView[];
  selectedActor: string | null;
  moodFilteredMovies: Movie[] | null;
  moodFilterName: string | null;
  setView: (view: AppView) => void;
  selectMovie: (movie: Movie) => void;
  setSearch: (query: string) => void;
  toggleSettings: () => void;
  goBack: () => void;
  cacheSearchResults: (query: string, results: Movie[]) => void;
  setActor: (name: string) => void;
  setMoodFilter: (movies: Movie[], name: string) => void;
  clearMoodFilter: () => void;
}

const MAX_HISTORY = 20;

export const useAppStore = create<AppState>((set, get) => ({
  view: 'login' as AppView,
  selectedMovie: null,
  searchQuery: '',
  showSettings: false,
  searchCache: {},
  viewHistory: [],
  selectedActor: null,
  moodFilteredMovies: null,
  moodFilterName: null,

  setView: (view: AppView) => {
    const { view: currentView, viewHistory } = get();
    const newHistory = [...viewHistory, currentView].slice(-MAX_HISTORY);
    set({ view, viewHistory: newHistory, showSettings: false });
  },

  selectMovie: (movie: Movie) => {
    const { view: currentView, viewHistory } = get();
    const newHistory = [...viewHistory, currentView].slice(-MAX_HISTORY);
    set({ selectedMovie: movie, view: 'detail' as AppView, viewHistory: newHistory, showSettings: false });
  },

  setSearch: (query: string) => {
    const { view: currentView, viewHistory } = get();
    let newHistory = viewHistory;
    if (currentView !== 'search') {
      newHistory = [...viewHistory, currentView].slice(-MAX_HISTORY);
    }
    set({ searchQuery: query, view: 'search' as AppView, viewHistory: newHistory, showSettings: false });
  },

  toggleSettings: () => {
    set((state) => ({ showSettings: !state.showSettings }));
  },

  goBack: () => {
    const { viewHistory } = get();
    if (viewHistory.length === 0) {
      set({ view: 'dashboard' as AppView, showSettings: false });
      return;
    }
    const newHistory = [...viewHistory];
    const previousView = newHistory.pop() || ('dashboard' as AppView);
    set({ view: previousView, viewHistory: newHistory, showSettings: false, selectedMovie: null });
  },

  cacheSearchResults: (query: string, results: Movie[]) => {
    if (!query.trim()) return;
    set((state) => ({
      searchCache: { ...state.searchCache, [query.trim().toLowerCase()]: results },
    }));
  },

  setActor: (name: string) => {
    const { view: currentView, viewHistory } = get();
    const newHistory = [...viewHistory, currentView].slice(-MAX_HISTORY);
    set({ selectedActor: name, view: 'actor' as AppView, viewHistory: newHistory, showSettings: false });
  },

  setMoodFilter: (filteredMovies: Movie[], name: string) => {
    set({ moodFilteredMovies: filteredMovies, moodFilterName: name });
  },

  clearMoodFilter: () => {
    set({ moodFilteredMovies: null, moodFilterName: null });
  },
}));
