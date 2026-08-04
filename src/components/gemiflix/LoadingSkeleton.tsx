'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================
   Shared animation variants
   ============================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

/* ============================================================
   Skeleton Movie Card
   ============================================================ */
export function SkeletonMovieCard({ count = 6 }: { count?: number }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-[var(--grid-gap)] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={fadeUp}>
          <div className="glass-card aspect-[2/3] overflow-hidden rounded-xl">
            {/* Poster area */}
            <div className="shimmer h-full w-full rounded-xl bg-white/5" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ============================================================
   Skeleton Detail Page
   ============================================================ */
export function SkeletonDetail() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mx-auto max-w-6xl px-4 pt-4 pb-12 md:px-8"
    >
      {/* Backdrop area */}
      <motion.div
        variants={fadeUp}
        className="glass-panel relative mb-6 h-48 overflow-hidden rounded-2xl sm:h-64 md:h-80"
      >
        <div className="shimmer absolute inset-0 bg-white/5" />
      </motion.div>

      {/* Metadata section */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Poster thumbnail */}
        <motion.div
          variants={fadeUp}
          className="glass-card-strong mx-auto w-40 shrink-0 overflow-hidden rounded-xl md:mx-0 md:w-48"
        >
          <div className="shimmer aspect-[2/3] w-full bg-white/5" />
        </motion.div>

        {/* Info rows */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Title */}
          <motion.div variants={fadeUp}>
            <div className="shimmer h-8 w-3/4 rounded-lg bg-white/5" />
          </motion.div>

          {/* Meta row 1: year, rating, duration, quality */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="shimmer h-5 w-14 rounded-md bg-white/5" />
            <div className="shimmer h-5 w-12 rounded-md bg-white/5" />
            <div className="shimmer h-5 w-16 rounded-md bg-white/5" />
            <div className="shimmer h-5 w-16 rounded-md bg-white/5" />
          </motion.div>

          {/* Genre chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            <div className="shimmer h-6 w-20 rounded-full bg-white/5" />
            <div className="shimmer h-6 w-24 rounded-full bg-white/5" />
            <div className="shimmer h-6 w-16 rounded-full bg-white/5" />
          </motion.div>

          {/* Synopsis lines */}
          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <div className="shimmer h-4 w-full rounded bg-white/5" />
            <div className="shimmer h-4 w-full rounded bg-white/5" />
            <div className="shimmer h-4 w-5/6 rounded bg-white/5" />
          </motion.div>

          {/* Cast row */}
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <div className="shimmer h-10 w-10 shrink-0 rounded-full bg-white/5" />
            <div className="shimmer h-10 w-10 shrink-0 rounded-full bg-white/5" />
            <div className="shimmer h-10 w-10 shrink-0 rounded-full bg-white/5" />
            <div className="shimmer h-10 w-10 shrink-0 rounded-full bg-white/5" />
          </motion.div>

          {/* Play button */}
          <motion.div variants={fadeUp}>
            <div className="glass-button-shine shimmer h-12 w-40 rounded-xl bg-white/5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Skeleton Player
   ============================================================ */
export function SkeletonPlayer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-deep flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl"
    >
      {/* Spinning loader */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-white/10"
          style={{
            borderTopColor: 'var(--accent-current)',
          }}
        />
        <span className="text-sm text-[var(--muted-foreground)]">
          Loading player…
        </span>
      </div>
    </motion.div>
  );
}
