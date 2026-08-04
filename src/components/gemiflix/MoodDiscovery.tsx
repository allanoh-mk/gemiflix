'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import { movies as allMovies } from '@/lib/mock-data';

interface Mood {
  name: string;
  icon: string;
  emoji: string;
  gradient: string;
  genres: string[];
  description: string;
}

const moods: Mood[] = [
  {
    name: 'Chill Vibes',
    icon: '🌅',
    emoji: '🌅',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
    genres: ['Drama', 'Romance', 'Documentary'],
    description: 'Unwind with heartfelt stories and gentle narratives',
  },
  {
    name: 'Adrenaline Rush',
    icon: '🔥',
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, #2d0000 0%, #6b0000 40%, #b91c1c 70%, #ff4500 100%)',
    genres: ['Action', 'Thriller', 'Horror'],
    description: 'Edge-of-your-seat thrills and non-stop excitement',
  },
  {
    name: 'Mind-Bending',
    icon: '🌀',
    emoji: '🌀',
    gradient: 'linear-gradient(135deg, #0d0221 0%, #1a0533 40%, #2d1b69 70%, #7b2ff7 100%)',
    genres: ['Sci-Fi', 'Fantasy', 'Thriller'],
    description: 'Twists, paradoxes, and reality-defying experiences',
  },
  {
    name: 'Feel Good',
    icon: '✨',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #1a2e1a 0%, #2d5a27 40%, #4ade80 70%, #fbbf24 100%)',
    genres: ['Comedy', 'Romance', 'Animation'],
    description: 'Warm smiles and uplifting moments await',
  },
  {
    name: 'Dark & Gritty',
    icon: '🌑',
    emoji: '🌑',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2d2d2d 70%, #4a4a4a 100%)',
    genres: ['Thriller', 'Horror', 'Drama'],
    description: 'Unflinching stories from the shadows',
  },
  {
    name: 'Epic Adventures',
    icon: '⚔️',
    emoji: '⚔️',
    gradient: 'linear-gradient(135deg, #1a0f00 0%, #4a2800 40%, #b45309 70%, #f59e0b 100%)',
    genres: ['Action', 'Fantasy', 'Sci-Fi'],
    description: 'Grand journeys across worlds unknown',
  },
  {
    name: 'Love Stories',
    icon: '💕',
    emoji: '💕',
    gradient: 'linear-gradient(135deg, #1a0011 0%, #4a0033 40%, #9d174d 70%, #f472b6 100%)',
    genres: ['Romance', 'Drama'],
    description: 'Tales of connection, passion, and the heart',
  },
  {
    name: 'Brain Food',
    icon: '🧠',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #001a1a 0%, #003d3d 40%, #0d9488 70%, #06b6d4 100%)',
    genres: ['Documentary', 'Drama', 'Sci-Fi'],
    description: 'Expand your mind with thought-provoking cinema',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

interface MoodDiscoveryProps {
  onMoodSelect: (movies: Movie[], moodName: string) => void;
}

export default function MoodDiscovery({ onMoodSelect }: MoodDiscoveryProps) {
  const getMovieCount = (mood: Mood): number => {
    return allMovies.filter((movie) =>
      movie.genres.some((genre) => mood.genres.includes(genre))
    ).length;
  };

  const handleMoodClick = (mood: Mood) => {
    const filtered = allMovies.filter((movie) =>
      movie.genres.some((genre) => mood.genres.includes(genre))
    );
    onMoodSelect(filtered, mood.name);
  };

  return (
    <section className="relative w-full px-4 py-8 md:px-12">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-[var(--accent-current)]" />
        <h2 className="text-xl font-bold heading-shadow text-[var(--foreground)]">
          Explore by Mood
        </h2>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {moods.map((mood) => {
          const count = getMovieCount(mood);
          return (
            <motion.button
              key={mood.name}
              variants={childVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMoodClick(mood)}
              className="glow-border-hover group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300"
              style={{ background: mood.gradient }}
              role="button"
              tabIndex={0}
              aria-label={`${mood.name}: ${count} movies`}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

              {/* Sheen sweep effect on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.04) 50%, transparent 54%)',
                  backgroundSize: '200% 100%',
                  animation: 'sheenSweep 0.8s ease forwards',
                }}
              />

              {/* Accent glow border on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow:
                    'inset 0 0 0 1px var(--accent-current), 0 0 20px color-mix(in srgb, var(--accent-current) 25%, transparent)',
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-3xl">{mood.emoji}</span>
                <h3 className="text-sm font-bold text-white">{mood.name}</h3>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-white/60">
                  {mood.description}
                </p>
                <span className="glass-chip mt-auto inline-flex w-fit text-[10px]">
                  {count} {count === 1 ? 'title' : 'titles'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
