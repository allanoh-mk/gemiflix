'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Bookmark, BookmarkCheck, Info, Star, Clock, X } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { showAddedToList, showRemovedFromList, showPlayingToast } from '@/lib/toast';

interface QuickPreviewProps {
  movie: Movie;
  anchorRect: DOMRect | null;
  visible: boolean;
  onClose: () => void;
}

/** Deterministic color from a string */
function stringToColor(str: string): string {
  const colors = [
    '#a855f7', '#ec4899', '#f97316', '#06b6d4',
    '#22c55e', '#eab308', '#ef4444', '#3b82f6',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Get initials from a name */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Format minutes into hours + minutes string */
function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function QuickPreview({
  movie,
  anchorRect,
  visible,
  onClose,
}: QuickPreviewProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectMovie = useAppStore((s) => s.selectMovie);
  const setView = useAppStore((s) => s.setView);
  const isInList = useWatchlistStore((s) => s.isInList(movie.id));
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);

  /* ---- Outside click ---- */
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, handleClickOutside]);

  /* ---- Actions ---- */
  const handlePlay = useCallback(() => {
    selectMovie(movie);
    setView('player');
    showPlayingToast(movie.title);
    onClose();
  }, [movie, selectMovie, setView, onClose]);

  const handleToggleList = useCallback(() => {
    toggleWatchlist(movie.id);
    if (isInList) {
      showRemovedFromList(movie.title);
    } else {
      showAddedToList(movie.title);
    }
  }, [movie, toggleWatchlist, isInList]);

  const handleMoreInfo = useCallback(() => {
    selectMovie(movie);
    onClose();
  }, [movie, selectMovie, onClose]);

  /* ---- Position calculation ---- */
  const positionStyle = (() => {
    if (!anchorRect) return { top: 0, left: 0, opacity: 0 };

    const panelW = typeof window !== 'undefined' && window.innerWidth >= 768 ? 320 : 260;
    const gap = 8;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;

    let left = anchorRect.left + anchorRect.width / 2 - panelW / 2;
    let top = anchorRect.top - gap;

    /* Assume an approximate panel height (~420px) and flip below if it overflows top */
    const approxH = 420;
    if (top - approxH < 0) {
      top = anchorRect.bottom + gap;
    } else {
      top = top - approxH;
    }

    /* Clamp horizontal to viewport */
    left = Math.max(8, Math.min(left, vw - panelW - 8));
    /* Clamp vertical */
    top = Math.max(8, Math.min(top, vh - approxH - 8));

    return { top, left };
  })();

  const topVal = typeof positionStyle.top === 'number' ? positionStyle.top : 0;
  const leftVal = typeof positionStyle.left === 'number' ? positionStyle.left : 0;

  return (
    <AnimatePresence>
      {visible && anchorRect && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            enter: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
            exit: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          className="glass-deep z-[90] overflow-hidden md:w-[320px] w-[260px]"
          style={{
            position: 'fixed',
            top: `${topVal}px`,
            left: `${leftVal}px`,
          }}
          role="dialog"
          aria-label={`Quick preview of ${movie.title}`}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="glass-button-shine absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white/70 transition-colors hover:bg-black/70 hover:text-white"
            aria-label="Close preview"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Backdrop / poster (aspect-video, landscape) */}
          <div className="relative aspect-video w-full overflow-hidden">
            {movie.backdropImage ? (
              <img
                src={movie.backdropImage}
                alt={movie.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: movie.posterGradient }}
              />
            )}
            {/* Bottom gradient fade into content */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--background)] to-transparent" />
          </div>

          {/* Content area */}
          <div className="flex flex-col gap-3 p-4">
            {/* Title */}
            <h3 className="text-lg font-bold leading-tight text-[var(--foreground)]">
              {movie.title}
            </h3>

            {/* Rating + Year + Duration row */}
            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                {movie.rating}
              </span>
              <span>{movie.year}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(movie.duration)}
              </span>
            </div>

            {/* Genre chips (max 3) */}
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.slice(0, 3).map((genre) => (
                <span key={genre} className="glass-chip">
                  {genre}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {movie.synopsis}
            </p>

            {/* Cast preview — first 3 cast members */}
            {movie.cast.length > 0 && (
              <div className="flex items-center gap-2">
                {movie.cast.slice(0, 3).map((member) => (
                  <div
                    key={member}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{
                      backgroundColor: stringToColor(member),
                    }}
                    title={member}
                  >
                    {getInitials(member)}
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons row */}
            <div className="flex items-center gap-2">
              {/* Play button */}
              <button
                onClick={handlePlay}
                className="glass-button-shine group flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-current)] px-3 py-2 text-sm font-semibold text-white transition-shadow hover:glow-accent-sm"
                aria-label={`Play ${movie.title}`}
              >
                <Play className="h-4 w-4 fill-white text-white" />
                Play
              </button>

              {/* Add to List button */}
              <button
                onClick={handleToggleList}
                className="glass-button-shine flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[var(--foreground)] transition-colors hover:bg-white/10"
                aria-label={isInList ? 'Remove from list' : 'Add to list'}
              >
                {isInList ? (
                  <BookmarkCheck className="h-4 w-4 text-[var(--accent-current)]" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>

              {/* More Info button */}
              <button
                onClick={handleMoreInfo}
                className="glass-button-shine flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[var(--foreground)] transition-colors hover:bg-white/10"
                aria-label="More information"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
