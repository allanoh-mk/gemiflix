'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Star, Calendar, Clock, Film, Tv, SlidersHorizontal, X } from 'lucide-react';

export interface SearchFilters {
  yearRange: [number, number];
  ratingRange: [number, number];
  type: 'all' | 'movie' | 'series';
  sortBy: 'rating' | 'year' | 'title' | 'duration';
}

interface AdvancedSearchFiltersProps {
  onFilterApply: (filters: SearchFilters) => void;
  onReset: () => void;
}

const defaultFilters: SearchFilters = {
  yearRange: [2015, 2025],
  ratingRange: [0, 10],
  type: 'all',
  sortBy: 'rating',
};

const typeOptions: { value: SearchFilters['type']; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
  { value: 'movie', label: 'Movies', icon: <Film className="h-3.5 w-3.5" /> },
  { value: 'series', label: 'Series', icon: <Tv className="h-3.5 w-3.5" /> },
];

const sortOptions: { value: SearchFilters['sortBy']; label: string }[] = [
  { value: 'rating', label: 'Rating' },
  { value: 'year', label: 'Year' },
  { value: 'title', label: 'Title' },
  { value: 'duration', label: 'Duration' },
];

export default function AdvancedSearchFilters({
  onFilterApply,
  onReset,
}: AdvancedSearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const handleTypeChange = (type: SearchFilters['type']) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const handleYearMin = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setFilters((prev) => ({ ...prev, yearRange: [Math.max(2015, Math.min(num, prev.yearRange[1]))] as [number, number] }));
    }
  };

  const handleYearMax = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setFilters((prev) => ({ ...prev, yearRange: [prev.yearRange[0], Math.min(2025, Math.max(num, prev.yearRange[0]))] as [number, number] }));
    }
  };

  const handleRatingMin = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setFilters((prev) => ({ ...prev, ratingRange: [Math.max(0, Math.min(num, prev.ratingRange[1]))] as [number, number] }));
    }
  };

  const handleRatingMax = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setFilters((prev) => ({ ...prev, ratingRange: [prev.ratingRange[0], Math.min(10, Math.max(num, prev.ratingRange[0]))] as [number, number] }));
    }
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleApply = () => {
    onFilterApply(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onReset();
  };

  return (
    <div className="relative w-full">
      {/* Toggle button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass-chip magnetic-hover flex items-center gap-2 transition-all duration-300"
        aria-expanded={isOpen}
        aria-label="Toggle search filters"
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Filter className="h-4 w-4" />
        )}
        <span className="text-xs font-medium">Filters</span>
      </motion.button>

      {/* Collapsible panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="glass-deep mt-4 rounded-xl p-6">
              {/* Type filter */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[var(--accent-current)]" />
                  <span className="text-sm font-semibold text-[var(--foreground)]">Type</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleTypeChange(opt.value)}
                      className={`glass-chip flex items-center gap-1.5 transition-all duration-200 ${
                        filters.type === opt.value ? 'active' : ''
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--accent-current)]" />
                  <span className="text-sm font-semibold text-[var(--foreground)]">Year Range</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={2015}
                    max={2025}
                    value={filters.yearRange[0]}
                    onChange={(e) => handleYearMin(e.target.value)}
                    className="glass-input h-9 w-24 rounded-lg px-3 text-sm text-[var(--foreground)] tabular-nums"
                    placeholder="From"
                    aria-label="Minimum year"
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">to</span>
                  <input
                    type="number"
                    min={2015}
                    max={2025}
                    value={filters.yearRange[1]}
                    onChange={(e) => handleYearMax(e.target.value)}
                    className="glass-input h-9 w-24 rounded-lg px-3 text-sm text-[var(--foreground)] tabular-nums"
                    placeholder="To"
                    aria-label="Maximum year"
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-[var(--accent-current)]" />
                  <span className="text-sm font-semibold text-[var(--foreground)]">Rating Range</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={filters.ratingRange[0]}
                    onChange={(e) => handleRatingMin(e.target.value)}
                    className="glass-input h-9 w-24 rounded-lg px-3 text-sm text-[var(--foreground)] tabular-nums"
                    placeholder="Min"
                    aria-label="Minimum rating"
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">to</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={filters.ratingRange[1]}
                    onChange={(e) => handleRatingMax(e.target.value)}
                    className="glass-input h-9 w-24 rounded-lg px-3 text-sm text-[var(--foreground)] tabular-nums"
                    placeholder="Max"
                    aria-label="Maximum rating"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--accent-current)]" />
                  <span className="text-sm font-semibold text-[var(--foreground)]">Sort By</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`glass-chip transition-all duration-200 ${
                        filters.sortBy === opt.value ? 'active' : ''
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleApply}
                  className="glass-button-shine glass-chip hover-scale flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[var(--foreground)]"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Apply Filters
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleReset}
                  className="glass-button-liquid glass-chip hover-scale px-6 py-2.5 text-sm font-medium text-[var(--muted-foreground)]"
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
