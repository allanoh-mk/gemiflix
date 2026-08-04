'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Film } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { movies as allMovies } from '@/lib/mock-data';
import MovieCard from './MovieCard';
import { useAppStore } from '@/lib/stores/app-store';

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const hash = simpleHash(name);
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 40%)`;
}

interface ActorSpotlightProps {
  actorName: string;
  movies: Movie[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ActorSpotlight({ actorName, movies }: ActorSpotlightProps) {
  const goBack = useAppStore((s) => s.goBack);
  const initials = getInitials(actorName);
  const avatarColor = getAvatarColor(actorName);

  // Also find any other movies this actor appears in from the full dataset
  const actorMovies = movies.length > 0
    ? movies
    : allMovies.filter((m) => m.cast.includes(actorName));

  const otherTitlesCount = actorMovies.length;

  return (
    <motion.section
      className="relative w-full px-4 py-8 md:px-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={`Actor spotlight: ${actorName}`}
    >
      {/* Back button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={goBack}
        className="hover-scale glass-chip mb-6 flex items-center gap-2"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-xs font-medium">Back</span>
      </motion.button>

      {/* Actor profile header */}
      <div className="glass-deep mb-8 flex items-center gap-6 rounded-xl p-6">
        {/* Avatar circle */}
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold heading-shadow text-[var(--foreground)]">
            {actorName}
          </h2>

          <div className="flex items-center gap-3">
            <span className="glass-chip inline-flex items-center gap-1.5">
              <Film className="h-3 w-3" />
              {otherTitlesCount} {otherTitlesCount === 1 ? 'title' : 'other titles'}
            </span>
          </div>
        </div>
      </div>

      {/* Filmography grid */}
      {actorMovies.length > 0 ? (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          }}
        >
          {actorMovies.map((movie, index) => (
            <div key={movie.id} style={{ '--card-width': '160px' } as React.CSSProperties}>
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-deep flex flex-col items-center justify-center gap-3 rounded-xl py-16">
          <Film className="h-10 w-10 text-[var(--muted-foreground)] animate-float-slow" />
          <p className="text-sm text-[var(--muted-foreground)]">
            No movies found for this actor in the current library.
          </p>
        </div>
      )}
    </motion.section>
  );
}
