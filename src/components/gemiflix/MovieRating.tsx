'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  localStorage-based user rating storage (simple module pattern)   */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'gemiflix-user-ratings';

function loadRatings(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function saveRating(movieId: string, rating: number): void {
  const ratings = loadRatings();
  ratings[movieId] = rating;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    // storage full or unavailable
  }
}

function removeRating(movieId: string): void {
  try {
    const ratings = loadRatings();
    delete ratings[movieId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    // ignore
  }
}

function getRating(movieId: string): number | null {
  return loadRatings()[movieId] ?? null;
}

/* ------------------------------------------------------------------ */
/*  Main MovieRating component                                       */
/* ------------------------------------------------------------------ */

interface MovieRatingProps {
  movieId: string;
  averageRating: number;
}

export default function MovieRating({ movieId, averageRating }: MovieRatingProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  // Load initial rating from localStorage on mount
  const initialRating = useMemo(() => getRating(movieId), [movieId]);
  React.useEffect(() => {
    setUserRating(initialRating);
  }, [initialRating]);

  const handleRate = useCallback(
    (rating: number) => {
      if (rating === userRating) {
        setUserRating(null);
        removeRating(movieId);
        toast.info('Rating removed');
      } else {
        setUserRating(rating);
        saveRating(movieId, rating);
        toast.success(`Rated ${rating}${rating === 1 ? ' star' : ' stars'}`);
      }
    },
    [movieId, userRating]
  );

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-2">
      {/* Interactive stars */}
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rate this movie"
        onMouseLeave={() => setHoveredValue(null)}
      >
        {stars.map((star) => {
          const isHovered = hoveredValue !== null && star <= hoveredValue;
          const isFilled = userRating !== null && star <= userRating;

          return (
            <motion.button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredValue(star)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              className="relative transition-transform"
              role="radio"
              aria-checked={userRating === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`h-7 w-7 transition-colors duration-150 ${
                  isHovered || isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-white/25'
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Rating display */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[var(--muted-foreground)]">
          Avg:{' '}
          <span className="font-semibold text-[var(--foreground)]">
            {averageRating.toFixed(1)}
          </span>
        </span>
        {userRating !== null && (
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-medium text-[var(--accent-current)]"
            >
              Your rating: {userRating}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
