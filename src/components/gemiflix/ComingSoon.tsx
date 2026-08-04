'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Bell, BellRing, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ComingSoonMovie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  genre: string;
  posterGradient: string;
  type: 'movie' | 'series';
}

const comingSoonMovies: ComingSoonMovie[] = [
  {
    id: 'cs-001',
    title: 'Quantum Echoes',
    description: 'A physicist discovers that parallel universes are collapsing into each other, and only she can prevent the ultimate convergence.',
    releaseDate: '2025-03-15',
    genre: 'Sci-Fi',
    posterGradient: 'linear-gradient(135deg, #0d0221 0%, #1a0533 30%, #4c1d95 60%, #7c3aed 100%)',
    type: 'movie',
  },
  {
    id: 'cs-002',
    title: 'The Last Cartographer',
    description: 'In a world where borders shift overnight, one mapmaker holds the key to stabilizing reality itself.',
    releaseDate: '2025-06-22',
    genre: 'Drama',
    posterGradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 30%, #78716c 60%, #d6d3d1 100%)',
    type: 'movie',
  },
  {
    id: 'cs-003',
    title: 'Midnight Protocol',
    description: 'A retired intelligence operative is pulled back into a web of conspiracy that reaches the highest levels of power.',
    releaseDate: '2025-09-10',
    genre: 'Thriller',
    posterGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #312e81 60%, #4338ca 100%)',
    type: 'movie',
  },
  {
    id: 'cs-004',
    title: 'Stellar Drift',
    description: 'A crew of deep-space explorers encounters an anomaly that challenges everything known about the fabric of spacetime.',
    releaseDate: '2025-12-05',
    genre: 'Sci-Fi',
    posterGradient: 'linear-gradient(135deg, #000814 0%, #001d3d 30%, #003566 60%, #00b4d8 100%)',
    type: 'movie',
  },
  {
    id: 'cs-005',
    title: 'The Painted Desert',
    description: 'A painter retreats to the Arizona desert and discovers ancient petroglyphs that hold a message for humanity\'s future.',
    releaseDate: '2026-02-14',
    genre: 'Drama',
    posterGradient: 'linear-gradient(135deg, #1a0f00 0%, #7c2d12 30%, #c2410c 60%, #fb923c 100%)',
    type: 'movie',
  },
];

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: string): Countdown {
  const calc = useCallback((): Countdown => {
    const now = Date.now();
    const target = new Date(targetDate).getTime();
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [countdown, setCountdown] = useState<Countdown>(calc);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(interval);
  }, [calc]);

  return countdown;
}

function formatReleaseDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ComingSoon() {
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -600 : 600;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const toggleNotify = (movie: ComingSoonMovie) => {
    setNotified((prev) => {
      const isNotified = !prev[movie.id];
      if (isNotified) {
        toast.success(`You\'ll be notified when "${movie.title}" arrives!`);
      } else {
        toast.info(`Notification removed for "${movie.title}"`);
      }
      return { ...prev, [movie.id]: isNotified };
    });
  };

  return (
    <section className="relative w-full px-4 py-8 md:px-12" aria-label="Coming Soon">
      <div className="mb-6 flex items-center gap-3">
        <Clock className="h-6 w-6 text-[var(--accent-current)]" />
        <h2 className="text-xl font-bold heading-shadow text-[var(--foreground)]">
          Coming Soon
        </h2>
        <span className="glass-chip ml-2">{comingSoonMovies.length} titles</span>
      </div>

      <div className="group relative">
        <button
          onClick={() => scroll('left')}
          className="hover-scale glass-panel absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-full"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-[var(--foreground)]" />
        </button>

        <motion.div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ scrollSnapType: 'x mandatory' } as React.CSSProperties}
        >
          {comingSoonMovies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={cardVariants}
              className="min-w-[280px] max-w-[280px] shrink-0 snap-start"
            >
              <div className="glass-card glow-border-hover glass-refraction flex h-full flex-col overflow-hidden rounded-xl">
                {/* Poster gradient area */}
                <div
                  className="relative h-36 w-full"
                  style={{ background: movie.posterGradient }}
                >
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

                  {/* Coming Soon badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #ef4444, #a855f7, #06b6d4)',
                        backgroundSize: '300% 300%',
                        animation: 'gradientText 4s ease infinite',
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Content area */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h3 className="text-sm font-bold text-[var(--foreground)]">
                    {movie.title}
                  </h3>

                  <span className="glass-chip inline-flex w-fit text-[10px]">
                    {movie.genre}
                  </span>

                  <p className="line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {movie.description}
                  </p>

                  <p className="text-xs text-[var(--muted-foreground)]">
                    {formatReleaseDate(movie.releaseDate)}
                  </p>

                  {/* Countdown */}
                  <CountdownDisplay movie={movie} />

                  {/* Notify button */}
                  <button
                    onClick={() => toggleNotify(movie)}
                    className={`glass-button-shine mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-300 ${
                      notified[movie.id]
                        ? 'text-[var(--accent-current)]'
                        : 'text-[var(--foreground)]'
                    }`}
                    style={{
                      background: notified[movie.id]
                        ? 'color-mix(in srgb, var(--accent-current) 15%, transparent)'
                        : 'var(--glass-bg)',
                      border: `1px solid ${notified[movie.id] ? 'color-mix(in srgb, var(--accent-current) 30%, transparent)' : 'var(--glass-border)'}`,
                    }}
                    aria-label={notified[movie.id] ? 'Remove notification' : 'Notify me'}
                  >
                    {notified[movie.id] ? (
                      <BellRing className="h-3.5 w-3.5" />
                    ) : (
                      <Bell className="h-3.5 w-3.5" />
                    )}
                    {notified[movie.id] ? 'Notified' : 'Notify Me'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <button
          onClick={() => scroll('right')}
          className="hover-scale glass-panel absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-full"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-[var(--foreground)]" />
        </button>
      </div>
    </section>
  );
}

function CountdownDisplay({ movie }: { movie: ComingSoonMovie }) {
  const { days, hours, minutes, seconds } = useCountdown(movie.releaseDate);

  const isReleased = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  if (isReleased) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[var(--accent-current)]/10 px-3 py-2">
        <span className="text-xs font-bold text-[var(--accent-current)]">
          Now Available!
        </span>
      </div>
    );
  }

  const units = [
    { value: days, label: 'D' },
    { value: hours, label: 'H' },
    { value: minutes, label: 'M' },
    { value: seconds, label: 'S' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {units.map((unit, i) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center rounded-md bg-white/5 px-2 py-1.5 min-w-[38px]">
            <span className="tabular-nums text-sm font-bold text-[var(--foreground)]">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-medium text-[var(--muted-foreground)]">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-xs font-bold text-[var(--muted-foreground)]">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
