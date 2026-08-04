'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Clock, Star, Bookmark, Film, Activity } from 'lucide-react';
import { useWatchHistoryStore, type WatchHistoryItem } from '@/lib/stores/watch-history-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { movies as allMovies } from '@/lib/mock-data';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRatingsFromStorage(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('gemiflix-ratings') || '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = Date.now();
  const diffMs = now - ts;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const genreColors: Record<string, string> = {
  Action: 'linear-gradient(90deg, #ef4444, #f97316)',
  Drama: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
  Comedy: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
  Thriller: 'linear-gradient(90deg, #dc2626, #991b1b)',
  'Sci-Fi': 'linear-gradient(90deg, #06b6d4, #3b82f6)',
  Horror: 'linear-gradient(90deg, #1f2937, #374151)',
  Romance: 'linear-gradient(90deg, #ec4899, #f472b6)',
  Animation: 'linear-gradient(90deg, #22c55e, #4ade80)',
  Documentary: 'linear-gradient(90deg, #0d9488, #14b8a6)',
  Fantasy: 'linear-gradient(90deg, #7c3aed, #c084fc)',
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="glass-card glow-border-hover flex flex-col gap-3 rounded-xl p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'color-mix(in srgb, var(--accent-current) 15%, transparent)' }}
        >
          {icon}
        </div>
      </div>
      <span className="text-3xl font-bold tabular-nums text-[var(--foreground)]">
        {value}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function WatchStatsView() {
  const historyItems = useWatchHistoryStore((s) => s.items);
  const watchlistItems = useWatchlistStore((s) => s.items);
  const ratings = getRatingsFromStorage();

  const totalWatched = historyItems.length;

  const hoursWatched = useMemo(() => {
    return historyItems.reduce((acc, item) => {
      const watchedSeconds = (item.progress / 100) * item.duration;
      return acc + watchedSeconds;
    }, 0) / 3600;
  }, [historyItems]);

  const ratingValues = Object.values(ratings);
  const averageRating =
    ratingValues.length > 0
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
      : '—';

  const watchlistSize = watchlistItems.length;

  /* Genre distribution from watch history */
  const genreDistribution = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    historyItems.forEach((item) => {
      const movie = allMovies.find((m) => m.id === item.movieId);
      if (movie) {
        movie.genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [historyItems]);

  const maxGenreCount = genreDistribution.length > 0 ? genreDistribution[0][1] : 1;

  /* Recent activity (last 5) */
  const recentActivity = historyItems.slice(0, 5);

  /* Rating breakdown */
  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 5-star, index 4 = 1-star
    ratingValues.forEach((r) => {
      const star = Math.round(r);
      if (star >= 1 && star <= 5) {
        counts[5 - star] += 1;
      }
    });
    return counts;
  }, [ratingValues]);

  const maxRatingCount = Math.max(...ratingBreakdown, 1);

  const hasData = totalWatched > 0 || ratingValues.length > 0 || watchlistSize > 0;

  /* ---- Empty state ---- */
  if (!hasData) {
    return (
      <motion.section
        className="flex min-h-[60vh] items-center justify-center px-4 md:px-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="glass-deep flex flex-col items-center gap-6 rounded-2xl px-12 py-16 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BarChart3 className="h-16 w-16 text-[var(--muted-foreground)]" />
          </motion.div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold heading-shadow text-[var(--foreground)]">
              Your Watch Stats
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
              Start watching movies and rating them to see your personalized statistics here.
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="w-full px-4 py-8 md:px-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Watch Statistics"
    >
 {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-[var(--accent-current)]" />
        <h2 className="text-xl font-bold heading-shadow text-[var(--foreground)]">
          Your Watch Stats
        </h2>
      </div>

      {/* Stat cards grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={<Eye className="h-4 w-4 text-[var(--accent-current)]" />}
          label="Total Watched"
          value={totalWatched}
        />
        <StatCard
          icon={<Clock className="h-4 w-4 text-[var(--accent-current)]" />}
          label="Hours Watched"
          value={hoursWatched.toFixed(1)}
        />
        <StatCard
          icon={<Star className="h-4 w-4 text-[var(--accent-current)]" />}
          label="Avg Rating"
          value={averageRating}
        />
        <StatCard
          icon={<Bookmark className="h-4 w-4 text-[var(--accent-current)]" />}
          label="Watchlist"
          value={watchlistSize}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Genre Distribution */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Genre Distribution
          </h3>
          {genreDistribution.length > 0 ? (
            <div className="flex flex-col gap-3">
              {genreDistribution.map(([genre, count]) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="glass-chip w-24 shrink-0 justify-center text-[10px]">
                    {genre}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxGenreCount) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: genreColors[genre] || 'var(--accent-current)',
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs tabular-nums text-[var(--muted-foreground)]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">No genre data yet.</p>
          )}
        </motion.div>

        {/* Rating Breakdown */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Rating Breakdown
          </h3>
          <div className="flex flex-col gap-3">
            {ratingBreakdown.map((count, index) => {
              const stars = 5 - index;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="flex w-10 shrink-0 items-center gap-0.5 text-xs text-[var(--muted-foreground)]">
                    {stars}
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxRatingCount) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs tabular-nums text-[var(--muted-foreground)]">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
          {ratingValues.length === 0 && (
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">No ratings yet.</p>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="glass-panel mt-6 rounded-xl p-6">
        <div className="mb-5 flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--accent-current)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Recent Activity
          </h3>
        </div>
        {recentActivity.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentActivity.map((item: WatchHistoryItem) => (
              <div
                key={item.movieId}
                className="glass-card flex items-center gap-4 rounded-lg p-3"
                style={{ borderLeft: '3px solid var(--accent-current)' }}
              >
                {/* Mini poster */}
                <div
                  className="h-10 w-7 shrink-0 rounded-md"
                  style={{ background: item.posterGradient }}
                />

                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {item.movieTitle}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {formatTimestamp(item.lastWatched)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="progress-bar-glow h-full rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs tabular-nums text-[var(--muted-foreground)]">
                    {Math.round(item.progress)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">No recent activity.</p>
        )}
      </motion.div>
    </motion.section>
  );
}
