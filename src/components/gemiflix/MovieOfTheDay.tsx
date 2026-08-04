'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Star, Play, BookmarkPlus, Sparkles, Clock } from 'lucide-react';
import { movies } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { showPlayingToast, showAddedToList } from '@/lib/toast';

/** Deterministic hash of a date string into a positive integer */
function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export default function MovieOfTheDay() {
  const selectMovie = useAppStore((s) => s.selectMovie);
  const setView = useAppStore((s) => s.setView);
  const watchlistToggle = useWatchlistStore((s) => s.toggle);
  const isInWatchlist = useWatchlistStore((s) => s.isInList);

  const movie = useMemo(() => {
    const today = new Date().toDateString();
    const index = hashDate(today) % movies.length;
    return movies[index];
  }, []);

  const bookmarked = isInWatchlist(movie.id);

  const handlePlay = () => {
    selectMovie(movie);
    showPlayingToast(movie.title);
  };

  const handleBookmark = () => {
    watchlistToggle(movie.id);
    if (!bookmarked) {
      showAddedToList(movie.title);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalf = rating / 2 - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400/50 text-amber-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-white/20" />
        );
      }
    }
    return stars;
  };

  // SSR guard
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return (
    <section className="relative z-10 px-4 md:px-8 lg:px-12 mt-6" aria-label="Movie of the Day">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="glass-panel glass-refraction relative overflow-hidden rounded-2xl p-1"
        style={{
          background: 'conic-gradient(from var(--gradient-angle, 0deg), color-mix(in srgb, var(--accent-current) 40%, transparent), transparent 30%, transparent 70%, color-mix(in srgb, var(--accent-current) 40%, transparent))',
          animation: 'gradientBorderRotate 4s linear infinite',
        }}
      >
        {/* Inner content card */}
        <div className="glass-card glass-card-inner-glow relative rounded-[14px] overflow-hidden">
          {/* MOVIE OF THE DAY badge */}
          <motion.div
            className="absolute top-4 left-4 z-10"
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="motd-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              MOVIE OF THE DAY
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
            {/* Left: Poster */}
            <motion.div
              className="relative flex-shrink-0 mx-auto sm:mx-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="motd-poster-ring w-36 sm:w-44 rounded-xl overflow-hidden">
                {movie.posterImage ? (
                  <img
                    src={movie.posterImage}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full aspect-[2/3] rounded-xl"
                    style={{ background: movie.posterGradient }}
                  />
                )}
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              className="flex flex-col justify-center flex-1 min-w-0 text-center sm:text-left"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold morphing-gradient-text mb-2 leading-tight">
                {movie.title}
              </h2>

              {/* Year + Duration */}
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-3 justify-center sm:justify-start">
                <span>{movie.year}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.duration} min
                </span>
              </div>

              {/* Genre badges */}
              <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                {movie.genres.map((genre) => (
                  <span key={genre} className="glass-chip text-xs">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                <div className="flex items-center gap-0.5">
                  {renderStars(movie.rating)}
                </div>
                <span className="text-sm font-semibold text-amber-400">{movie.rating}</span>
              </div>

              {/* Synopsis (truncated to 3 lines) */}
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4 line-clamp-3">
                {movie.synopsis}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlay}
                  className="glass-button-shine flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: 'color-mix(in srgb, var(--accent-current) 85%, white)',
                    boxShadow: '0 4px 15px color-mix(in srgb, var(--accent-current) 30%, transparent)',
                  }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBookmark}
                  className="glass-button-shine flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--foreground)] border border-[var(--glass-border)] hover:bg-white/5 transition-colors"
                  style={{
                    background: bookmarked
                      ? 'color-mix(in srgb, var(--accent-current) 20%, transparent)'
                      : 'rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <BookmarkPlus
                    className={`w-4 h-4 ${bookmarked ? 'fill-[var(--accent-current)] text-[var(--accent-current)]' : ''}`}
                  />
                  {bookmarked ? 'In List' : 'Add to List'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
