'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Clock, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Movie } from '@/lib/mock-data';

interface TrailerModalProps {
  movie: Movie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrailerModal({
  movie,
  open,
  onOpenChange,
}: TrailerModalProps) {
  const posterSrc = movie.posterImage;
  const fallbackGradient = movie.posterGradient;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="glass-deep max-w-2xl border-white/10 bg-black/80 p-0 overflow-hidden"
      >
        {/* Animated entry wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Custom close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="glass-panel absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close trailer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Trailer preview area */}
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
            {/* Background gradient simulating a video frame */}
            <div
              className="absolute inset-0"
              style={{
                background: movie.backdropGradient ?? movie.posterGradient,
              }}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Centered play icon with pulsing ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <motion.div
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Play className="h-7 w-7 translate-x-0.5 text-white fill-white/90" />
                {/* Outer pulse ring */}
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-white/20"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
              <span className="text-sm font-medium text-white/60">
                Watch Trailer
              </span>
            </div>

            {/* Duration & views overlay — bottom left */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3">
              <span className="glass-chip flex items-center gap-1.5 text-xs text-white/70">
                <Clock className="h-3 w-3" />
                Duration: 2:34
              </span>
              <span className="glass-chip flex items-center gap-1.5 text-xs text-white/70">
                <Eye className="h-3 w-3" />
                Views: 1.2M
              </span>
            </div>
          </div>

          {/* Info section below the trailer */}
          <div className="flex items-start gap-4 p-5">
            {/* Poster thumbnail */}
            <div className="hidden h-24 w-16 shrink-0 overflow-hidden rounded-lg sm:block">
              {posterSrc ? (
                <img
                  src={posterSrc}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full rounded-lg"
                  style={{ background: fallbackGradient }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <DialogHeader className="gap-1">
                <DialogTitle className="text-white truncate text-lg font-semibold">
                  {movie.title} — Official Trailer
                </DialogTitle>
                <DialogDescription className="text-white/40 text-sm">
                  {movie.year} · {movie.genres.join(', ')}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
