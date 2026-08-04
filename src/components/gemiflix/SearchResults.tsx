'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Database } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';
import MovieCard from '@/components/gemiflix/MovieCard';
import { SkeletonMovieCard } from '@/components/gemiflix/LoadingSkeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function SearchResults() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const searchCache = useAppStore((s) => s.searchCache);
  const cacheSearchResults = useAppStore((s) => s.cacheSearchResults);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      setIsCached(false);
      return;
    }

    /* Check cache first */
    const cacheKey = query.trim().toLowerCase();
    const cached = searchCache[cacheKey];
    if (cached) {
      setResults(cached);
      setIsLoading(false);
      setHasSearched(true);
      setIsCached(true);
      return;
    }

    setIsLoading(true);
    setIsCached(false);
    try {
      const res = await fetch(
        `/api/movies?search=${encodeURIComponent(query.trim())}`
      );
      if (res.ok) {
        const data = await res.json();
        const movies = data.movies || [];
        setResults(movies);
        cacheSearchResults(query, movies);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }, [searchCache, cacheSearchResults]);

  /* Debounced search */
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      setIsCached(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      fetchResults(searchQuery);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, fetchResults]);

  if (!searchQuery.trim()) {
    return null;
  }

  return (
    <section className="animate-fade-in px-4 pt-4 pb-8 md:px-8 md:pt-6">
      {/* Results header */}
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-white md:text-xl">
          {isLoading
            ? <span className="shimmer inline-block w-32 h-5 rounded bg-white/5" />
            : hasSearched && results.length > 0
              ? <>{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;</>
              : hasSearched && results.length === 0
                ? <>No results for &ldquo;{searchQuery}&rdquo;</>
                : <>Searching for &ldquo;{searchQuery}&rdquo;</>}
        </h2>
        {/* Cached badge */}
        {isCached && hasSearched && results.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40"
          >
            <Database className="h-2.5 w-2.5" />
            Cached
          </motion.span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && <SkeletonMovieCard count={12} />}

      {/* No results state */}
      {!isLoading && hasSearched && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-deep flex flex-col items-center justify-center gap-4 px-6 py-20 rounded-2xl"
        >
          <div className="animate-float-slow flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
            <Search className="h-10 w-10 text-white/20" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white/60">
              No results found
            </p>
            <p className="mt-2 text-sm text-white/30 max-w-sm">
              Try different keywords, check your spelling, or browse our curated collections
            </p>
          </div>
        </motion.div>
      )}

      {/* Results grid */}
      {!isLoading && results.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={searchQuery}
          className="grid gap-[var(--grid-gap)] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {results.map((movie, index) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <MovieCard movie={movie} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
