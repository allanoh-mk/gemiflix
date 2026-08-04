'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ArrowLeft, Sparkles } from 'lucide-react';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { useAppStore } from '@/lib/stores/app-store';
import { movies } from '@/lib/mock-data';
import MovieCard from '@/components/gemiflix/MovieCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function MyListView() {
  const goBack = useAppStore((s) => s.goBack);
  const watchlistItems = useWatchlistStore((s) => s.items);

  const watchlistMovies = useMemo(() => {
    return watchlistItems
      .map((id) => movies.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined);
  }, [watchlistItems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative min-h-[60vh]"
    >
      {/* Header */}
      <div className="sticky top-16 z-20 glass-panel px-4 py-4 md:px-8 md:py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--foreground)]" />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-gradient-animated text-2xl font-bold md:text-3xl">
              My List
            </h1>
            {watchlistMovies.length > 0 && (
              <motion.span
                key={watchlistMovies.length}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--accent-current)]/20 px-2 text-xs font-bold text-[var(--accent-current)]"
              >
                {watchlistMovies.length}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 md:px-8 md:py-8">
        {watchlistMovies.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {watchlistMovies.map((movie, idx) => (
              <motion.div key={movie.id} variants={itemVariants}>
                <MovieCard movie={movie} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24"
          >
            {/* Animated bookmark icon */}
            <motion.div
              className="glass-card flex h-28 w-28 items-center justify-center rounded-3xl"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Bookmark className="h-14 w-14 text-[var(--accent-current)]/60" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Your list is empty
              </h2>
              <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
                Browse movies and shows, then tap the bookmark icon to save them
                here for easy access.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-current)]/50" />
              <span>Start building your personal collection</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
