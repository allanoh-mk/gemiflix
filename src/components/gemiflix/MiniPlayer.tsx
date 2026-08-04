'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Maximize2, Volume2 } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';
import { usePlayerStore } from '@/lib/stores/player-store';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MiniPlayer() {
  const view = useAppStore((s) => s.view);
  const selectedMovie = useAppStore((s) => s.selectedMovie);
  const setView = useAppStore((s) => s.setView);
  const selectMovie = useAppStore((s) => s.selectMovie);

  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const playerSeek = usePlayerStore((s) => s.seek);

  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine if MiniPlayer should be visible: playing and not on player view
  const showMiniPlayer = view !== 'player' && isPlaying && selectedMovie !== null;

  // Real-time progress polling via store.getState()
  useEffect(() => {
    if (!showMiniPlayer) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const sync = () => {
      const s = usePlayerStore.getState();
      setLocalCurrentTime(s.currentTime);
      setLocalDuration(s.duration);
    };

    intervalRef.current = setInterval(sync, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [showMiniPlayer]);

  // Seek scrubber handlers
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || localDuration <= 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = fraction * localDuration;
      playerSeek(newTime);
      setLocalCurrentTime(newTime);
    },
    [localDuration, playerSeek]
  );

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsSeeking(true);

      if (progressRef.current && localDuration > 0) {
        const rect = progressRef.current.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setSeekValue(fraction * localDuration);
      }

      const handleMouseMove = (ev: MouseEvent) => {
        if (!progressRef.current || localDuration <= 0) return;
        const rect = progressRef.current.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        setSeekValue(fraction * localDuration);
      };

      const handleMouseUp = (ev: MouseEvent) => {
        setIsSeeking(false);
        if (progressRef.current && localDuration > 0) {
          const rect = progressRef.current.getBoundingClientRect();
          const fraction = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
          const newTime = fraction * localDuration;
          playerSeek(newTime);
          setLocalCurrentTime(newTime);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [localDuration, playerSeek]
  );

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const handleClose = useCallback(() => {
    pause();
  }, [pause]);

  const handleExpand = useCallback(() => {
    if (selectedMovie) {
      selectMovie(selectedMovie);
      setView('player');
    }
  }, [selectedMovie, selectMovie, setView]);

  const progressFraction =
    localDuration > 0
      ? (isSeeking ? seekValue : localCurrentTime) / localDuration
      : 0;

  return (
    <AnimatePresence>
      {showMiniPlayer && (
        <motion.div
          key="mini-player"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="fixed bottom-6 right-4 z-[100] md:bottom-8 md:right-6"
          style={{
            boxShadow: `0 0 30px color-mix(in srgb, var(--accent-current) 20%, transparent),
              0 0 60px color-mix(in srgb, var(--accent-current) 10%, transparent)`,
          }}
        >
          {/* Desktop version */}
          <div className="hidden md:flex glass-deep rounded-2xl overflow-hidden items-center gap-3 p-3 w-[360px]">
            {/* Poster thumbnail */}
            <div
              className="shrink-0 w-12 h-12 rounded-lg overflow-hidden"
              style={{
                background: selectedMovie.posterGradient,
              }}
            >
              {selectedMovie.posterImage ? (
                <img
                  src={selectedMovie.posterImage}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Info + controls */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              {/* Title row */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {selectedMovie.title}
                </h4>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleExpand}
                    className="glass-button-shine flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="Expand to player"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
                    aria-label="Close mini player"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar (seek scrubber) */}
              <div
                ref={progressRef}
                className="relative h-1.5 w-full cursor-pointer rounded-full overflow-hidden"
                style={{ background: 'var(--glass-border)' }}
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={localDuration}
                aria-valuenow={isSeeking ? seekValue : localCurrentTime}
                tabIndex={0}
              >
                <div
                  className="progress-bar-glow h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${Math.max(0, Math.min(100, progressFraction * 100))}%`,
                    background: 'var(--accent-current)',
                  }}
                />
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="glass-button-shine flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                    style={{
                      background: 'color-mix(in srgb, var(--accent-current) 20%, transparent)',
                      color: 'var(--accent-current)',
                    }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <Volume2 className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                </div>
                <span className="text-[11px] tabular-nums text-[var(--muted-foreground)]">
                  {formatTime(isSeeking ? seekValue : localCurrentTime)}
                  <span className="mx-1 opacity-40">/</span>
                  {formatTime(localDuration)}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile compact version */}
          <div className="flex md:hidden glass-deep rounded-2xl overflow-hidden items-center gap-2.5 p-2.5 w-[280px]">
            {/* Poster thumbnail */}
            <div
              className="shrink-0 w-10 h-10 rounded-lg overflow-hidden"
              style={{
                background: selectedMovie.posterGradient,
              }}
            >
              {selectedMovie.posterImage ? (
                <img
                  src={selectedMovie.posterImage}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Title + compact controls */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <h4 className="truncate text-xs font-semibold text-[var(--foreground)] max-w-[140px]">
                {selectedMovie.title}
              </h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleTogglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: 'color-mix(in srgb, var(--accent-current) 20%, transparent)',
                    color: 'var(--accent-current)',
                  }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
                  aria-label="Close mini player"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
