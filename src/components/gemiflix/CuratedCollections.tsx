'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { movies } from '@/lib/mock-data';
import type { Movie } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';

interface Collection {
  id: string;
  title: string;
  description: string;
  gradient: string;
  movieIds: string[];
}

const collections: Collection[] = [
  {
    id: 'weekend-binge',
    title: 'Weekend Binge',
    description: 'Binge-worthy series and sagas',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    movieIds: ['mv-001', 'mv-004', 'mv-010', 'mv-022', 'mv-028'],
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    description: 'Underrated masterpieces you missed',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    movieIds: ['mv-003', 'mv-006', 'mv-009', 'mv-015', 'mv-019'],
  },
  {
    id: 'date-night',
    title: 'Date Night',
    description: 'Perfect picks for two',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    movieIds: ['mv-008', 'mv-012', 'mv-014', 'mv-018', 'mv-025'],
  },
  {
    id: 'adrenaline-rush',
    title: 'Adrenaline Rush',
    description: 'Heart-pounding action & thrillers',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    movieIds: ['mv-001', 'mv-005', 'mv-007', 'mv-011', 'mv-013'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function CuratedCollections() {
  const setView = useAppStore((s) => s.setView);
  const setSearch = useAppStore((s) => s.setSearch);

  // Resolve movie data for each collection
  const resolvedCollections = useMemo(() => {
    return collections.map((col) => {
      const collectionMovies: Movie[] = col.movieIds
        .map((id) => movies.find((m) => m.id === id))
        .filter((m): m is Movie => m !== undefined);
      return { ...col, resolvedMovies: collectionMovies };
    });
  }, []);

  // When clicking a collection, open search with first genre from movies
  const handleCollectionClick = (col: (typeof resolvedCollections)[0]) => {
    if (col.resolvedMovies.length > 0) {
      const firstGenre = col.resolvedMovies[0].genres[0];
      setSearch(firstGenre);
    }
  };

  // SSR guard
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return (
    <section className="relative z-10 mt-6 mb-6 px-4 md:px-8 lg:px-12" aria-label="Curated Collections">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Curated For You</h2>
      </div>

      <motion.div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {resolvedCollections.map((col) => (
          <motion.button
            key={col.id}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCollectionClick(col)}
            className="collection-card glass-card glass-refraction relative flex-shrink-0 w-[280px] sm:w-[320px] h-[160px] rounded-xl overflow-hidden cursor-pointer text-left group"
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity duration-350"
              style={{ background: col.gradient }}
            />

            {/* Glass overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-350" />

            {/* Shine sweep on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'sheenSweep 0.8s ease-in-out forwards',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-between h-full p-5">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <h3 className="text-lg font-bold text-white leading-tight">{col.title}</h3>
                <p className="text-sm text-white/70 leading-snug">{col.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="glass-chip text-xs text-white/80 border-white/10">
                    {col.resolvedMovies.length} {col.resolvedMovies.length === 1 ? 'title' : 'titles'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Stacked poster thumbnails */}
              <div className="collection-poster-stack flex items-center flex-shrink-0 ml-4">
                {col.resolvedMovies.slice(0, 3).map((movie, idx) => (
                  <div
                    key={movie.id}
                    className="relative w-12 h-[68px] rounded-lg overflow-hidden shadow-lg border border-white/10"
                    style={{ zIndex: 3 - idx }}
                  >
                    {movie.posterImage ? (
                      <img
                        src={movie.posterImage}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: movie.posterGradient }}
                      />
                    )}
                  </div>
                ))}
                {col.resolvedMovies.length > 3 && (
                  <div
                    className="relative w-12 h-[68px] rounded-lg overflow-hidden border border-white/10"
                    style={{ zIndex: 0, marginLeft: '-24px' }}
                  >
                    <div className="w-full h-full bg-black/60 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white/70">
                        +{col.resolvedMovies.length - 3}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
