'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';

interface MediaInfoOverlayProps {
  movie: Movie;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MediaInfoOverlay({
  movie,
  currentTime,
  duration,
  isPlaying,
}: MediaInfoOverlayProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPlayingRef = useRef(false);

  // Track play/pause transitions and manage timer
  useEffect(() => {
    if (!isPlaying) {
      prevPlayingRef.current = false;
      return;
    }

    // Only trigger overlay on transition from paused to playing
    if (!prevPlayingRef.current) {
      prevPlayingRef.current = true;

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Show overlay and set auto-hide timer (setState in setTimeout callback is fine)
      const showTimer = setTimeout(() => {
        setVisible(true);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          timerRef.current = null;
        }, 3000);
      }, 0);

      return () => {
        clearTimeout(showTimer);
      };
    }
  }, [isPlaying]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="media-info-overlay"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <div className="glass-panel max-w-md w-[90%] rounded-2xl p-5 space-y-3">
            {/* Now Playing indicator */}
            <div className="flex items-center gap-2">
              <motion.span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: 'var(--accent-current)',
                  boxShadow: '0 0 6px var(--accent-current), 0 0 12px color-mix(in srgb, var(--accent-current) 30%, transparent)',
                }}
                animate={{ opacity: [1, 0.4, 1], scale: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Now Playing
              </span>
              <Film className="h-3.5 w-3.5 text-white/30" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gradient-animated leading-tight">
              {movie.title}
            </h3>

            {/* Metadata row */}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="font-medium">{movie.year}</span>
              <span className="text-white/20">·</span>
              <span>{movie.genres.slice(0, 3).join(', ')}</span>
            </div>

            {/* Time display */}
            <div className="flex items-center gap-2 text-sm">
              <Play className="h-3.5 w-3.5 text-white/40" />
              <span className="font-mono text-white/70">
                {formatTime(currentTime)}
              </span>
              <span className="text-white/30">/</span>
              <span className="font-mono text-white/40">
                {formatTime(duration)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="progress-bar-glow h-full rounded-full"
                style={{
                  background: 'var(--accent-current)',
                  width: `${progress}%`,
                }}
                layout={false}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
