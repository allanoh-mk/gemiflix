'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '@/lib/mock-data';
import MovieCard from './MovieCard';

interface CategoryRailProps {
  title: string;
  movies: Movie[];
  icon?: React.ReactNode;
}

export default function CategoryRail({ title, movies, icon }: CategoryRailProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 3,
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollBy(-800);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollBy(800);
  }, [emblaApi]);


  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', handler);
    emblaApi.on('reInit', handler);
    emblaApi.on('resize', handler);
    return () => {
      emblaApi.off('select', handler);
      emblaApi.off('reInit', handler);
      emblaApi.off('resize', handler);
    };
  }, [emblaApi]);

  if (!movies || movies.length === 0) return null;

  return (
    <section className="section-hover relative w-full py-6" aria-label={title}>
      <div className="mb-4 flex items-center gap-2 px-4 md:px-12">
        {icon && <span className="text-[var(--accent-current)]">{icon}</span>}
        <h2 className="rail-title text-lg font-semibold text-[var(--foreground)]">{title}</h2>
        <span className="ml-auto text-xs text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100">{movies.length} titles</span>
      </div>

      <div className="group relative rounded-xl">
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="hover-scale glass-panel absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 sm:opacity-100 rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-[var(--foreground)]" />
          </button>
        )}

        <div ref={emblaRef} className="overflow-hidden px-4 md:px-12">
          <div
            className="flex scrollbar-hide"
            style={{
              gap: 'var(--grid-gap)',
              scrollSnapType: 'x mandatory',
            } as React.CSSProperties}
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="min-w-0 shrink-0 snap-start"
                style={{ '--card-width': '180px' } as React.CSSProperties}
              >
                <MovieCard movie={movie} index={index} />
              </div>
            ))}
          </div>
        </div>

        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="hover-scale glass-panel absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 sm:opacity-100 rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-[var(--foreground)]" />
          </button>
        )}
      </div>
    </section>
  );
}
