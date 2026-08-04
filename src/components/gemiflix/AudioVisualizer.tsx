'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}

/** Seeded pseudo-random: returns a value between 0 and 1 using index as offset */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateRandomHeights(barCount: number, height: number): number[] {
  const base = Date.now();
  return Array.from({ length: barCount }, (_, i) => {
    const seed = base + i * 7.13;
    const random = seededRandom(seed);
    return height * (0.2 + random * 0.8);
  });
}

export default function AudioVisualizer({
  isPlaying,
  barCount = 24,
  height = 32,
  className = '',
}: AudioVisualizerProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const heights = useMemo(() => {
    if (!isPlaying) {
      return Array.from({ length: barCount }, () => height * 0.15);
    }
    return generateRandomHeights(barCount, height);
  }, [isPlaying, tick, barCount, height]);

  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          animate={{ height: h }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(to top, var(--accent-current), color-mix(in srgb, var(--accent-current) 50%, transparent))',
            boxShadow: '0 0 6px color-mix(in srgb, var(--accent-current) 20%, transparent)',
          }}
        />
      ))}
    </div>
  );
}
