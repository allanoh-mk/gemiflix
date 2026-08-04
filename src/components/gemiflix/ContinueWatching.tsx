'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Movie } from '@/lib/mock-data';
import { movies } from '@/lib/mock-data';
import { useWatchHistoryStore } from '@/lib/stores/watch-history-store';
import MovieCard from './MovieCard';

interface HistoryEntry {
  movieId: string;
  progress: number;
  duration: number;
}

interface MergedEntry {
  movieId: string;
  progress: number;
  duration: number;
  source: 'api' | 'store';
}

export default function ContinueWatching() {
  const [apiHistory, setApiHistory] = useState<MergedEntry[]>([]);
  const storeItems = useWatchHistoryStore((s) => s.items);
  const removeFromHistory = useWatchHistoryStore((s) => s.removeFromHistory);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 3,
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json();
          const entries: MergedEntry[] = (data.history || [])
            .filter((h: HistoryEntry) => h.progress > 0 && h.progress < h.duration && h.duration > 0)
            .map((h: HistoryEntry) => ({
              movieId: h.movieId,
              progress: h.progress,
              duration: h.duration,
              source: 'api' as const,
            }))
            .slice(0, 12);
          setApiHistory(entries);
        }
      } catch {
        // silent
      }
    };
    fetchHistory();
  }, []);

  const mergedHistory: MergedEntry[] = React.useMemo(() => {
    const map = new Map<string, MergedEntry>();
    for (const entry of apiHistory) {
      map.set(entry.movieId, entry);
    }
    for (const item of storeItems) {
      map.set(item.movieId, {
        movieId: item.movieId,
        progress: (item.progress / 100) * item.duration,
        duration: item.duration,
        source: 'store',
      });
    }
    return Array.from(map.values()).slice(0, 12);
  }, [apiHistory, storeItems]);

  const scrollPrev = useCallback(() => { emblaApi?.scrollBy(-800); }, [emblaApi]);
  const scrollNext = useCallback(() => { emblaApi?.scrollBy(800); }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', handler);
    emblaApi.on('reInit', handler);
    emblaApi.on('resize', handler);
    return () => {
      emblaApi.off('select', handler);
      emblaApi.off('reInit', handler);
      emblaApi.off('resize', handler);
    };
  }, [emblaApi]);

  if (mergedHistory.length === 0) return null;

  const historyMovies: Movie[] = mergedHistory
    .map((h) => movies.find((m) => m.id === h.movieId))
    .filter((m): m is Movie => m !== undefined);

  if (historyMovies.length === 0) return null;

  const getProgressPercent = (movieId: string): string => {
    const entry = mergedHistory.find((h) => h.movieId === movieId);
    if (!entry || entry.duration === 0) return '0%';
    return `${Math.min((entry.progress / entry.duration) * 100, 100).toFixed(0)}%`;
  };

  const handleRemove = (e: React.MouseEvent, movieId: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromHistory(movieId);
  };

  return (
    <section className="relative w-full py-6" aria-label="Continue Watching">
      <div className="section-hover mb-4 flex items-center gap-2 px-4 md:px-12">
        <Clock className="h-5 w-5 text-[var(--accent-current)]" />
        <h2 className="rail-title text-lg font-semibold text-[var(--foreground)]">Continue Watching</h2>
      </div>

      <div className="group relative">
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="hover-scale glass-panel absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 sm:opacity-100 rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-[var(--foreground)]" />
          </button>
        )}

        <div ref={emblaRef} className="overflow-hidden px-4 md:px-12">
          <div
            className="flex scrollbar-hide"
            style={{
              gap: 'var(--grid-gap)',
              scrollSnapType: 'x mandatory',
            } as React.CSSProperties}
          >
            {historyMovies.map((movie, idx) => (
              <div
                key={movie.id}
                className="group/item min-w-0 shrink-0 snap-start relative"
                style={{
                  '--card-width': '180px',
                  '--watch-progress': getProgressPercent(movie.id),
                } as React.CSSProperties}
              >
                <MovieCard movie={movie} index={idx} />
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => handleRemove(e, movie.id)}
                  className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover/item:opacity-100 hover:text-white"
                  aria-label={`Remove ${movie.title} from history`}
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="hover-scale glass-panel absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 sm:opacity-100 rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-[var(--foreground)]" />
          </button>
        )}
      </div>
    </section>
  );
}
