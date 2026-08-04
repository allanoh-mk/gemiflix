'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Movie } from '@/lib/mock-data';
import { movies } from '@/lib/mock-data';
import { TrendingUp } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function TopCharts() {
  const top10 = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10),
    []
  );

  return (
    <section className="relative z-10 mb-8 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-[var(--accent-current)]" />
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Top Charts</h2>
          <p className="text-xs text-[var(--muted-foreground)]">This Week&apos;s Most Watched</p>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-glass"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {top10.map((movie, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;
          return (
            <motion.div
              key={movie.id}
              variants={itemVariants}
              className="glass-card glass-refraction press-scale shrink-0"
              style={{
                width: '200px',
                scrollSnapAlign: 'start',
                transform: rank === 1 ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-3 p-4">
                {/* Rank badge */}
                <div className="glass-badge-pulse flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <span
                    className={`text-2xl font-black ${
                      isTopThree ? 'text-gradient-fire' : 'text-[var(--muted-foreground)]'
                    }`}
                  >
                    {rank}
                  </span>
                </div>

                {/* Poster */}
                <div className="group relative shrink-0 overflow-hidden rounded-lg">
                  <div
                    className="h-16 w-12 rounded-lg transition-transform duration-500 group-hover:animate-float-slow"
                    style={{
                      background: movie.posterImage
                        ? `url(${movie.posterImage}) center/cover`
                        : movie.posterGradient,
                    }}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {movie.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="glass-chip rounded-full px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      ★ {movie.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
