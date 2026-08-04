'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Film, Tv, Star, Clock } from 'lucide-react';
import { movies, seriesList } from '@/lib/mock-data';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
 suffix?: string;
 decimals?: number;
 accentColor: string;
 delay: number;
}

function AnimatedCounter({
  target,
  decimals = 0,
  inView,
}: {
  target: number;
  decimals?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, inView]);

  return <>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}</>;
}

function StatCard({ icon, value, label, suffix, decimals = 0, accentColor, delay }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bento-stat-enhanced glass-card-hover glass-deep magnetic-glow glass-refraction group relative flex flex-col items-center justify-center gap-3 p-5 md:p-6 overflow-hidden rounded-2xl"
    >
      {/* Subtle accent glow behind icon */}
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: accentColor }}
      />

      <div
        className="animate-float-slow flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${accentColor}20` }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-[var(--foreground)] md:text-3xl tabular-nums">
          <AnimatedCounter target={value} decimals={decimals} inView={inView} />
          {suffix && (
            <span className="ml-0.5 text-lg font-medium text-[var(--muted-foreground)]">
              {suffix}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs font-medium tracking-wide text-[var(--muted-foreground)] uppercase md:text-sm">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export default function BentoStats() {
  const totalMovies = movies.filter((m) => m.type === 'movie').length;
  const totalSeries = seriesList.length;
  const avgRating = movies.reduce((sum, m) => sum + m.rating, 0) / movies.length;
  const totalMinutes = movies.reduce((sum, m) => sum + m.duration, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const stats: StatCardProps[] = [
    {
      icon: <Film className="h-5 w-5" />,
      value: totalMovies,
      label: 'Total Movies',
      suffix: '+',
      accentColor: 'var(--accent-purple)',
      delay: 0,
    },
    {
      icon: <Tv className="h-5 w-5" />,
      value: totalSeries,
      label: 'Series',
      suffix: '+',
      accentColor: 'var(--accent-cyan)',
      delay: 0.08,
    },
    {
      icon: <Star className="h-5 w-5" />,
      value: avgRating,
      label: 'Avg Rating',
      decimals: 1,
      accentColor: 'var(--accent-orange)',
      delay: 0.16,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      value: totalHours,
      label: 'Total Hours',
      suffix: '+',
      accentColor: 'var(--accent-current)',
      delay: 0.24,
    },
  ];

  return (
    <div className="stagger-grid grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
