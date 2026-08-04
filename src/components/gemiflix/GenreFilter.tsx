'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { genres } from '@/lib/mock-data';

interface GenreFilterProps {
  onFilterChange: (genre: string | null) => void;
  activeGenre: string | null;
}

export default function GenreFilter({ onFilterChange, activeGenre }: GenreFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const allGenres = ['All', ...genres];

  useEffect(() => {
    if (activeGenre && containerRef.current) {
      const activeEl = containerRef.current.querySelector(`[data-genre="${activeGenre}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeGenre]);

  return (
    <div className="relative z-10 px-4 md:px-12">
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        role="tablist"
        aria-label="Filter by genre"
      >
        {allGenres.map((genre) => {
          const isActive = genre === 'All' ? activeGenre === null : activeGenre === genre;
          return (
            <button
              key={genre}
              data-genre={genre}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(genre === 'All' ? null : genre)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-white'
                  : 'glass-card text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="genre-filter-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--accent-current)' }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{genre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
