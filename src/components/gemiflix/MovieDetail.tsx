'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Star, Clock, Film, Tv, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/stores/app-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { showPlayingToast, showAddedToList, showRemovedFromList } from '@/lib/toast';
import MovieRating from '@/components/gemiflix/MovieRating';
import TrailerModal from '@/components/gemiflix/TrailerModal';
import SimilarMovies from '@/components/gemiflix/SimilarMovies';
import EpisodeList from '@/components/gemiflix/EpisodeList';
import ReviewsSection from '@/components/gemiflix/ReviewsSection';
import ShareButton from '@/components/gemiflix/ShareButton';
import MovieTrivia from '@/components/gemiflix/MovieTrivia';

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default function MovieDetail() {
  const movie = useAppStore((s) => s.selectedMovie);
  const goBack = useAppStore((s) => s.goBack);
  const setView = useAppStore((s) => s.setView);
  const selectMovie = useAppStore((s) => s.selectMovie);
  const isInList = useWatchlistStore((s) => s.items.includes(movie?.id ?? ''));
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);

  const [selectedQuality, setSelectedQuality] = useState<string | null>(movie?.qualities[0] ?? null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const handlePlay = useCallback(() => {
    if (!movie) return;
    selectMovie(movie);
    setView('player');
    showPlayingToast(movie.title);
  }, [movie, selectMovie, setView]);

  const handleToggleWatchlist = useCallback(() => {
    if (!movie) return;
    toggleWatchlist(movie.id);
    if (isInList) {
      showRemovedFromList(movie.title);
    } else {
      showAddedToList(movie.title);
    }
  }, [movie, toggleWatchlist, isInList]);

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-panel px-8 py-12 text-center">
          <Film className="mx-auto mb-4 h-12 w-12 text-[var(--muted-foreground)]" />
          <p className="text-[var(--muted-foreground)]">No movie selected</p>
          <Button
            onClick={goBack}
            variant="ghost"
            className="mt-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* BACKDROP SECTION */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {movie.backdropImage ? (
          <img
            src={movie.backdropImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: movie.backdropGradient }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/80 via-transparent to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={goBack}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full glass-panel text-[var(--foreground)] transition-colors hover:bg-white/10 md:left-6 md:top-6"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        {/* Bookmark button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={handleToggleWatchlist}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full glass-panel text-[var(--foreground)] transition-colors hover:bg-white/10 md:right-6 md:top-6"
          aria-label={isInList ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isInList ? (
            <BookmarkCheck className="h-5 w-5 text-[var(--accent-current)]" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </motion.button>

        {/* Floating title in backdrop */}
        <div className="absolute bottom-8 left-4 right-4 z-10 md:bottom-10 md:left-6 md:right-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl font-bold text-white drop-shadow-2xl md:text-5xl lg:text-6xl"
          >
            {movie.title}
          </motion.h1>
          {movie.originalTitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-1 text-sm text-white/60 md:text-base"
            >
              {movie.originalTitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="relative z-10 -mt-6 px-4 pb-16 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-panel p-6 md:p-8"
        >
          {/* Quick Info */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {movie.rating.toFixed(1)}
              </span>
            </div>

            <span className="text-sm text-[var(--muted-foreground)]">{movie.year}</span>

            {movie.genres.map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className="border-[var(--glass-border)] bg-white/5 text-xs text-[var(--foreground)]"
              >
                {genre}
              </Badge>
            ))}

            <Badge
              variant="outline"
              className="border-[var(--glass-border)] bg-white/5 text-xs text-[var(--muted-foreground)]"
            >
              <Clock className="mr-1 h-3 w-3" />
              {formatDuration(movie.duration)}
            </Badge>

            <Badge
              variant="outline"
              className="border-[var(--glass-border)] bg-white/5 text-xs text-[var(--muted-foreground)]"
            >
              {movie.type === 'series' ? (
                <>
                  <Tv className="mr-1 h-3 w-3" />
                  {movie.seasons} {movie.seasons === 1 ? 'Season' : 'Seasons'}
                </>
              ) : (
                <>
                  <Film className="mr-1 h-3 w-3" />
                  Movie
                </>
              )}
            </Badge>

            <span className="text-xs text-[var(--muted-foreground)]">
              Dir. {movie.director}
            </span>
          </div>

          {/* Synopsis */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 leading-relaxed text-[var(--muted-foreground)]"
          >
            {movie.synopsis}
          </motion.p>

          {/* User Rating */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mb-6"
          >
            <MovieRating movieId={movie.id} averageRating={movie.rating} />
          </motion.div>

          {/* Episodes (series only) */}
          {movie.type === 'series' && movie.seasons && (
            <EpisodeList movieId={movie.id} seasons={movie.seasons} />
          )}

          {/* Cast & Director */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Director
              </h3>
              <p className="text-sm font-medium text-[var(--foreground)]">{movie.director}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Cast
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <button
                    key={actor}
                    onClick={() => useAppStore.getState().setActor(actor)}
                    className="glass-chip genre-chip-interactive px-3 py-1 text-sm text-[var(--foreground)]"
                  >
                    {actor}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quality Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mt-6"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Quality
            </h3>
            <div className="flex flex-wrap gap-2">
              {movie.qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuality(q)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedQuality === q
                      ? 'bg-[var(--accent-current)] text-white magnetic-glow'
                      : 'glass-chip text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button
              onClick={() => setTrailerOpen(true)}
              className="magnetic-glow breathe-glow glass-button-shine flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-[var(--accent-current)] hover:opacity-90 transition-opacity"
            >
              <Play className="h-4 w-4" />
              Watch Trailer
            </Button>

            <Button
              onClick={handlePlay}
              className="glass-button-liquid flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-white/5 px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white/10"
            >
              <Play className="h-4 w-4 fill-current" />
              Play Now
            </Button>

            <Button
              onClick={handleToggleWatchlist}
              variant="outline"
              className={`rounded-xl border px-5 py-3 text-sm font-medium transition-all ${
                isInList
                  ? 'border-[var(--accent-current)]/40 bg-[var(--accent-current)]/10 text-[var(--accent-current)]'
                  : 'border-[var(--glass-border)] bg-white/5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10'
              }`}
            >
              {isInList ? (
                <BookmarkCheck className="mr-2 h-4 w-4" />
              ) : (
                <Bookmark className="mr-2 h-4 w-4" />
              )}
              {isInList ? 'In My List' : 'Add to List'}
            </Button>

            <ShareButton movieId={movie.id} movieTitle={movie.title} />
          </motion.div>
        </motion.div>

        {/* SIMILAR MOVIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8"
        >
          <SimilarMovies movie={movie} />
        </motion.div>

        {/* FUN FACTS / TRIVIA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8"
        >
          <MovieTrivia movieId={movie.id} />
        </motion.div>

        {/* AUDIENCE REVIEWS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="glass-panel p-6 md:p-8">
            <ReviewsSection movieId={movie.id} />
          </div>
        </motion.div>

      </div>

      {/* TRAILER MODAL */}
      <TrailerModal
        movie={movie}
        open={trailerOpen}
        onOpenChange={setTrailerOpen}
      />
    </motion.div>
  );
}
