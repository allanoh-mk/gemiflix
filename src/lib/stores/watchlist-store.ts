import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  isInList: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (id: string) => {
        set((state) => {
          if (state.items.includes(id)) return state;
          return { items: [...state.items, id] };
        });
      },

      remove: (id: string) => {
        set((state) => ({
          items: state.items.filter((itemId) => itemId !== id),
        }));
      },

      toggle: (id: string) => {
        const { items } = get();
        if (items.includes(id)) {
          set({ items: items.filter((itemId) => itemId !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },

      isInList: (id: string) => {
        return get().items.includes(id);
      },
    }),
    {
      name: 'gemiflix-watchlist',
    }
  )
);
