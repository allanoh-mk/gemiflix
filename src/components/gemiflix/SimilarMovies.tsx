'use client';

import React, { useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { movies } from '@/lib/mock-data';
import MovieCard from '@/components/gemiflix/MovieCard';

interface SimilarMoviesProps {
  movie: Movie;
}

export default function SimilarMovies({ movie }: SimilarMoviesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const similar = useMemo(() => {
    return movies
      .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
      .sort((a, b) => {
        const overlapA = a.genres.filter((g) => movie.genres.includes(g)).length;
        const overlapB = b.genres.filter((g) => movie.genres.includes(g)).length;
        if (overlapB !== overlapA) return overlapB - overlapA;
        return b.rating - a.rating;
      })
      .slice(0, 6);
  }, [movie]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 380;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  if (similar.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-8"
    >
      <div className="mb-4 flex items-center justify-between px-4 md:px-0">
        <div className="flex items-center gap-2.5">
          <Shuffle className="h-5 w-5 text-[var(--accent-current)]" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] md:text-xl">
            More Like This
          </h2>
          <span className="text-sm text-[var(--muted-foreground)]">
            {similar.length} {similar.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/5 text-[var(--muted-foreground)] transition-all hover:bg-white/10 hover:text-[var(--foreground)]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/5 text-[var(--muted-foreground)] transition-all hover:bg-white/10 hover:text-[var(--foreground)]"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2"
        style={{ '--card-width': '180px' } as React.CSSProperties}
      >
        {similar.map((m, idx) => (
          <MovieCard key={m.id} movie={m} index={idx} />
        ))}
      </div>
    </motion.section>
  );
}
