'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { featuredMovies } from '@/lib/mock-data';
import { useAppStore } from '@/lib/stores/app-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';
import { showPlayingToast, showAddedToList, showRemovedFromList } from '@/lib/toast';

type MovieSlide = (typeof featuredMovies)[number];

function formatDuration(minutes: number): string {
  if (minutes === 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

const SLIDE_INTERVAL = 8000;

function SparkleParticle({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute bottom-0 h-1 w-1 rounded-full bg-white/40"
      style={{ left: `${x}%` }}
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{
        y: [0, -120, -240],
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.3],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sparkleSeeds = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.4 + Math.random() * 0.5,
      x: 10 + Math.random() * 80,
    }))
  );

  const selectMovie = useAppStore((s) => s.selectMovie);
  const setView = useAppStore((s) => s.setView);
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);
  const watchlistItems = useWatchlistStore((s) => s.items);

  const slides: MovieSlide[] = featuredMovies.length > 0 ? featuredMovies : [];
  const currentSlide = slides[currentIndex] ?? null;
  const isInList = currentSlide ? watchlistItems.includes(currentSlide.id) : false;

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL);
  }, [nextSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;
    resetTimer();

    const handleHeroNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.direction === -1) {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (detail?.direction === 1) {
        nextSlide();
      }
      resetTimer();
    };

    window.addEventListener('gemiflix:hero-navigate', handleHeroNavigate);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('gemiflix:hero-navigate', handleHeroNavigate);
    };
  }, [slides.length, resetTimer, nextSlide]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    mousePosRef.current = { x, y };
    setMousePos({ x, y });
  }, []);

  const handlePlayNow = useCallback(() => {
    if (!currentSlide) return;
    selectMovie(currentSlide);
    setView('player');
    showPlayingToast(currentSlide.title);
  }, [currentSlide, selectMovie, setView]);

  const handleMoreInfo = useCallback(() => {
    if (!currentSlide) return;
    selectMovie(currentSlide);
  }, [currentSlide, selectMovie]);

  const handleBookmark = useCallback(() => {
    if (!currentSlide) return;
    toggleWatchlist(currentSlide.id);
    if (isInList) {
      showRemovedFromList(currentSlide.title);
    } else {
      showAddedToList(currentSlide.title);
    }
  }, [currentSlide, toggleWatchlist, isInList]);

  if (slides.length === 0) {
    return (
      <div className="flex h-[85vh] min-h-[500px] items-center justify-center">
        <p className="text-[var(--muted-foreground)]">No featured content available</p>
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
    }),
    center: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[85vh] min-h-[500px] w-full overflow-hidden"
      role="region"
      aria-label="Featured movies carousel"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        {currentSlide && (
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Backdrop: image or gradient fallback */}
            {currentSlide.backdropImage ? (
              <img
                src={currentSlide.backdropImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                style={{
                  transform: `scale(1.1) translate(${mousePos.x}px, ${mousePos.y}px)`,
                }}
              />
            ) : (
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{
                  background: currentSlide.backdropGradient,
                  transform: `scale(1.1) translate(${mousePos.x}px, ${mousePos.y}px)`,
                }}
              />
            )}

            {/* Dark gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/80 via-transparent to-transparent" />

            {/* Sparkle particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              {sparkleSeeds.current.map((seed) => (
                <SparkleParticle key={seed.id} delay={seed.delay} x={seed.x} />
              ))}
            </div>

            {/* Movie info at bottom-left */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-12 md:pb-20">
              <div className="relative max-w-2xl space-y-4 rounded-2xl p-6 md:p-8 glass-card-strong glass-card-inner-glow overflow-hidden">
                {/* Animated gradient border */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background: `conic-gradient(from var(--gradient-angle, 0deg), transparent 60%, var(--accent-current) 80%, transparent 100%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px',
                    borderRadius: 'inherit',
                  }}
                />

                <h2 className="text-3xl font-bold leading-tight md:text-5xl neon-text">
                  {currentSlide.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                  <span className="font-medium text-[var(--foreground)]">{currentSlide.year}</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium text-[var(--foreground)]">{currentSlide.rating}</span>
                  </span>
                  {currentSlide.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(currentSlide.duration)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentSlide.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="border-[var(--glass-border)] bg-white/5 text-xs text-[var(--foreground)]"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)] md:line-clamp-3 md:text-base">
                  {currentSlide.synopsis}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={handlePlayNow}
                    className="glow-accent glass-button-shine flex items-center gap-2 bg-[var(--accent-current)] font-semibold text-white hover:opacity-90"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play Now
                  </Button>
                  <Button
                    onClick={handleMoreInfo}
                    variant="outline"
                    className="flex items-center gap-2 border-[var(--glass-border)] bg-white/5 text-[var(--foreground)] hover:bg-white/10"
                  >
                    <Info className="h-4 w-4" />
                    More Info
                  </Button>
                  <Button
                    onClick={handleBookmark}
                    variant="outline"
                    className="flex items-center gap-2 border-[var(--glass-border)] bg-white/5 text-[var(--foreground)] hover:bg-white/10"
                  >
                    {isInList ? (
                      <BookmarkCheck className="h-4 w-4 fill-[var(--accent-current)] text-[var(--accent-current)]" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {isInList ? 'In List' : 'My List'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation dots at bottom-right */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex items-center gap-2 md:bottom-10 md:right-12">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-[var(--accent-current)]'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
