'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app-store';
import { showPlayingToast } from '@/lib/toast';

/* ------------------------------------------------------------------ */
/*  Deterministic episode generator (seeded by movie id + season)     */
/* ------------------------------------------------------------------ */

interface Episode {
  number: number;
  title: string;
  duration: number;
}

const EPISODE_TITLES: Record<string, string[]> = {
  'mv-014': [
    'The First Colony Ship', 'Mars Approach', 'Red Dust',
    'Power Struggle', 'Generations', 'The Kepler Gate',
    'Sins of the Founders', 'Interstellar War', 'New Horizons',
    'The Long Silence',
  ],
  'mv-019': [
    'Shattered Reflection', "The Glassblower's Secret", 'Court of Mirrors',
    'Enchanted Flames', 'The Prophecy Unfolds', 'Crystal Vows',
    'The Darkening Sky', 'Fractured Kingdom',
  ],
  'mv-024': [
    'Iron Dawn', 'The Diesel Heart', "No Man's Land",
    'Mech Uprising', 'Across the Wasteland', 'The Final Engine',
    'Steel Requiem', "War's End",
  ],
  'mv-028': [
    'Descent', 'The Abyss Stares Back', 'Pressure',
    'Bioluminescence', 'The Signal', 'Colony protocols',
    'Harvest', 'Ascension',
  ],
};

const DEFAULT_TITLES = [
  'Pilot', 'Breaking Point', 'The Crossing',
  'Aftermath', 'Revelations', 'The Turning Point',
  'Endgame', 'New Dawn', 'Convergence',
  'Shadows', 'The Reckoning', 'Legacy',
];

function generateEpisodes(movieId: string, seasonNum: number, seasonCount: number): Episode[] {
  const titles = EPISODE_TITLES[movieId] ?? DEFAULT_TITLES;
  const episodesPerSeason = Math.ceil(titles.length / seasonCount);
  const startIdx = (seasonNum - 1) * episodesPerSeason;
  const count = seasonNum < seasonCount
    ? episodesPerSeason
    : titles.length - startIdx;

  const episodes: Episode[] = [];
  for (let i = 0; i < count; i++) {
    const titleIdx = startIdx + i;
    const title = titles[titleIdx] ?? `Episode ${i + 1}`;
    // Deterministic pseudo-random duration: 38-62 minutes
    const seed = (movieId.charCodeAt(2) * 7 + seasonNum * 13 + i * 17) % 25;
    const duration = 38 + seed;
    episodes.push({ number: i + 1, title, duration });
  }
  return episodes;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/* ------------------------------------------------------------------ */
/*  EpisodeList component                                             */
/* ------------------------------------------------------------------ */

interface EpisodeListProps {
  movieId: string;
  seasons: number;
}

export default function EpisodeList({ movieId, seasons }: EpisodeListProps) {
  const seasonCount = seasons;
  const [activeSeason, setActiveSeason] = useState(1);
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);

  const setView = useAppStore((s) => s.setView);
  const selectMovie = useAppStore((s) => s.selectMovie);
  const selectedMovie = useAppStore((s) => s.selectedMovie);

  const episodes = generateEpisodes(movieId, activeSeason, seasonCount);

  const handlePlayEpisode = useCallback(
    (episode: Episode) => {
      if (!selectedMovie) return;
      selectMovie(selectedMovie);
      setView('player');
      showPlayingToast(`${selectedMovie.title} - S${String(activeSeason).padStart(2, '0')}E${String(episode.number).padStart(2, '0')}`);
    },
    [selectedMovie, activeSeason, selectMovie, setView]
  );

  const toggleEpisode = useCallback((num: number) => {
    setExpandedEpisode((prev) => (prev === num ? null : num));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-8"
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)] md:text-xl">
          Episodes
        </h2>
        <span className="text-sm text-[var(--muted-foreground)]">
          {seasonCount} {seasonCount === 1 ? 'Season' : 'Seasons'}
        </span>
      </div>

      {/* Season tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {Array.from({ length: seasonCount }, (_, i) => i + 1).map((s) => (
          <button
            key={s}
            onClick={() => {
              setActiveSeason(s);
              setExpandedEpisode(null);
            }}
            className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeSeason === s
                ? 'bg-[var(--accent-current)]/20 text-[var(--accent-current)]'
                : 'bg-white/5 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)]'
            }`}
            aria-pressed={activeSeason === s}
          >
            Season {s}
            {activeSeason === s && (
              <motion.div
                layoutId="episode-season-indicator"
                className="absolute inset-0 rounded-lg border border-[var(--accent-current)]/40"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Episode rows */}
      <div className="glass-panel overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`season-${activeSeason}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {episodes.map((ep, idx) => {
              const isExpanded = expandedEpisode === ep.number;
              return (
                <motion.div
                  key={ep.number}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  {/* Main row */}
                  <div
                    className={`group flex cursor-pointer items-center gap-4 border-b border-[var(--glass-border)] px-4 py-3 transition-colors hover:bg-white/[0.03] ${
                      idx === episodes.length - 1 ? 'border-b-0' : ''
                    }`}
                    onClick={() => toggleEpisode(ep.number)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleEpisode(ep.number);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    {/* Episode number */}
                    <span className="shrink-0 w-8 text-center text-sm font-bold tabular-nums text-[var(--muted-foreground)]">
                      {ep.number}
                    </span>

                    {/* Play button (visible on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayEpisode(ep);
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-current)]/20 text-[var(--accent-current)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--accent-current)]/30"
                      aria-label={`Play episode ${ep.number}`}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>

                    {/* Title */}
                    <span className="flex-1 truncate text-sm font-medium text-[var(--foreground)]">
                      {ep.title}
                    </span>

                    {/* Duration */}
                    <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--muted-foreground)]">
                      <Clock className="h-3 w-3" />
                      {formatDuration(ep.duration)}
                    </span>

                    {/* Expand chevron */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </motion.div>
                  </div>

                  {/* Expanded description (simulated) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-b border-[var(--glass-border)] bg-white/[0.02] px-4 py-3"
                      >
                        <p className="mb-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                          A compelling episode from Season {activeSeason} that continues the
                          story with unexpected twists and character development.
                        </p>
                        <button
                          onClick={() => handlePlayEpisode(ep)}
                          className="glass-button-shine flex items-center gap-2 rounded-lg bg-[var(--accent-current)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          Play Episode
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
