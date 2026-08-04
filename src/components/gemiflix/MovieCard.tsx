'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Play, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { showAddedToList, showRemovedFromList } from '@/lib/toast';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const selectMovie = useAppStore((s) => s.selectMovie);
  const isInList = useWatchlistStore((s) => s.isInList(movie.id));
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);

  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const shineX = useSpring(50, { stiffness: 200, damping: 25 });
  const shineY = useSpring(50, { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxRotation = 12;
    rotateX.set((-mouseY / (rect.height / 2)) * maxRotation);
    rotateY.set((mouseX / (rect.width / 2)) * maxRotation);

    shineX.set(((e.clientX - rect.left) / rect.width) * 100);
    shineY.set(((e.clientY - rect.top) / rect.height) * 100);
  }, [rotateX, rotateY, shineX, shineY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    shineX.set(50);
    shineY.set(50);
  }, [rotateX, rotateY, shineX, shineY]);

  const handleClick = useCallback(() => {
    selectMovie(movie);
  }, [movie, selectMovie]);

  const handleBookmarkClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleWatchlist(movie.id);
      if (isInList) {
        showRemovedFromList(movie.title);
      } else {
        showAddedToList(movie.title);
      }
    },
    [movie, toggleWatchlist, isInList]
  );

  const staggerDelay = index * 0.05;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: staggerDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative shrink-0 cursor-pointer"
      style={{ width: 'var(--card-width, 180px)' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
      }}
      aria-label={`${movie.title} (${movie.year})`}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative aspect-[2/3] overflow-hidden rounded-xl transition-shadow duration-300 ${isHovered ? 'glow-accent-sm' : ''}`}
      >
        {/* Poster */}
        {movie.posterImage ? (
          <img src={movie.posterImage} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0" style={{ background: movie.posterGradient }} />
        )}

        {/* Shine overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${shineX.get()}% ${shineY.get()}%, rgba(255,255,255,0.6) 0%, transparent 60%)`,
          }}
        />

        {/* Diagonal sheen sweep on hover */}
        <motion.div className="pointer-events-none absolute inset-0 z-30" style={{ opacity: isHovered ? 1 : 0 }}>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 54%)',
              backgroundSize: '200% 100%',
              animation: isHovered ? 'sheenSweep 0.8s ease forwards' : 'none',
            }}
          />
        </motion.div>

        {/* Border glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-xl"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: 'inset 0 0 0 1px var(--accent-current), 0 0 15px color-mix(in srgb, var(--accent-current) 30%, transparent)',
          }}
        />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold text-white">{movie.rating}</span>
        </div>

        {/* Bookmark button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-2 left-2 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80"
          aria-label={isInList ? 'Remove from list' : 'Add to list'}
          style={movie.type === 'series' ? { top: '32px' } : undefined}
        >
          {isInList ? (
            <BookmarkCheck className="h-3.5 w-3.5 fill-[var(--accent-current)] text-[var(--accent-current)]" />
          ) : (
            <Bookmark className="h-3.5 w-3.5 text-white/70 hover:text-white" />
          )}
        </button>

        {/* Series badge */}
        {movie.type === 'series' && (
          <div className="absolute top-2 left-2 z-10 rounded-md bg-[var(--accent-current)]/90 px-2 py-0.5 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Series</span>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Title */}
        <div className="absolute inset-x-0 bottom-0 z-[1] p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{movie.title}</h3>
          <p className="mt-0.5 text-xs text-white/70">{movie.year}</p>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-current)]/90"
          >
            <Play className="h-5 w-5 fill-white text-white" />
          </motion.div>
          {movie.type === 'series' && movie.seasons && (
            <p className="mt-2 text-xs text-white/80">{movie.seasons} {movie.seasons === 1 ? 'Season' : 'Seasons'}</p>
          )}
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 z-40 h-[3px] overflow-hidden rounded-b-xl">
        <div
          className="progress-bar-glow h-full rounded-full transition-all duration-500"
          style={{ width: 'var(--watch-progress, 0%)', background: 'var(--accent-current)' }}
        />
      </div>
    </motion.div>
  );
}
