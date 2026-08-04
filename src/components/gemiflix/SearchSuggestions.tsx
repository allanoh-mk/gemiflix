'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Search } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (query: string) => void;
}

// Predefined popular / trending search terms derived from the movie dataset — no API calls.
const POPULAR_TERMS: string[] = [
  'Crimson Meridian',
  'The Silent Architect',
  'Neon Requiem',
  'Starfall Dynasty',
  'Pulse',
  'Sci-Fi',
  'Action',
  'Thriller',
  'Drama',
  'Beyond the Veil',
];

export default function SearchSuggestions({
  query,
  onSelect,
}: SearchSuggestionsProps) {
  // Filter the predefined list by the current query
  const filtered = useMemo(() => {
    if (!query.trim()) return POPULAR_TERMS;
    const lower = query.toLowerCase();
    return POPULAR_TERMS.filter((term) =>
      term.toLowerCase().includes(lower)
    );
  }, [query]);

  // Don't render when empty or nothing matches
  if (filtered.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="suggestions"
        initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: 'top center' }}
        className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl bg-black/85 backdrop-blur-xl border border-[var(--glass-border)] p-2"
      >
        <div className="flex items-center gap-2 px-3 pb-2 pt-1">
          <TrendingUp className="h-3.5 w-3.5 text-[var(--accent-current)]" />
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            {query.trim() ? 'Suggestions' : 'Trending Searches'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 px-1 pb-1">
          {filtered.map((term, i) => (
            <motion.button
              key={term}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.2,
                delay: i * 0.03,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              onClick={() => onSelect(term)}
              className="glass-chip flex items-center gap-1.5 text-xs transition-colors active:scale-95"
            >
              <Search className="h-3 w-3 opacity-40" />
              {term}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
