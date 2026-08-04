'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Bookmark, Tv, CheckCircle } from 'lucide-react';
import { movies } from '@/lib/mock-data';

type ActivityType = 'played' | 'rated' | 'added_to_list' | 'started_series' | 'completed_movie';

interface Activity {
  id: string;
  type: ActivityType;
  movieTitle: string;
  relativeTime: string;
  text: string;
}

const ACTIVITY_CONFIG: Record<ActivityType, { icon: typeof Play; color: string; label: string }> = {
  played: { icon: Play, color: 'text-cyan-400', label: 'played' },
  rated: { icon: Star, color: 'text-amber-400', label: 'rated' },
  added_to_list: { icon: Bookmark, color: 'text-purple-400', label: 'added to list' },
  started_series: { icon: Tv, color: 'text-green-400', label: 'started watching' },
  completed_movie: { icon: CheckCircle, color: 'text-[var(--accent-current)]', label: 'completed' },
};

const RELATIVE_TIMES = ['just now', '1m ago', '2m ago', '5m ago', '15m ago', '30m ago', '1h ago', '3h ago'];

const GUEST_NAMES = ['Guest', 'Alex', 'Jordan', 'Sam', 'Riley', 'Casey', 'Morgan', 'Taylor'];

function generateActivity(id: string): Activity {
  const types: ActivityType[] = ['played', 'rated', 'added_to_list', 'started_series', 'completed_movie'];
  const type = types[Math.floor(Math.random() * types.length)];
  const movie = movies[Math.floor(Math.random() * movies.length)];
  const guest = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
  const config = ACTIVITY_CONFIG[type];

  let text: string;
  switch (type) {
    case 'played':
      text = `${guest} played ${movie.title}`;
      break;
    case 'rated':
      text = `${guest} rated ${movie.title} ★ ${movie.rating.toFixed(1)}`;
      break;
    case 'added_to_list':
      text = `${guest} added ${movie.title} to their list`;
      break;
    case 'started_series':
      text = `${guest} started watching ${movie.title}`;
      break;
    case 'completed_movie':
      text = `${guest} completed ${movie.title}`;
      break;
  }

  return {
    id,
    type,
    movieTitle: movie.title,
    relativeTime: RELATIVE_TIMES[0],
    text,
  };
}

function getInitialActivities(): Activity[] {
  return Array.from({ length: 8 }, (_, i) => {
    const activity = generateActivity(`seed-${i}`);
    activity.relativeTime = RELATIVE_TIMES[Math.min(i + 1, RELATIVE_TIMES.length - 1)];
    return activity;
  });
}

const slideIn = {
  initial: { opacity: 0, y: -20, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit: { opacity: 0, y: -10, height: 0 },
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(getInitialActivities);
  const counterRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const addNewActivity = useCallback(() => {
    counterRef.current += 1;
    const newActivity = generateActivity(`auto-${Date.now()}-${counterRef.current}`);
    setActivities((prev) => [newActivity, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    const interval = setInterval(addNewActivity, 30000);
    return () => clearInterval(interval);
  }, [addNewActivity]);

  return (
    <div ref={containerRef} className="glass-card max-h-64 overflow-y-auto scroll-fade-bottom scrollbar-glass p-4">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="pulsing-dot-live" />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Live Activity</h3>
      </div>

      {/* Feed items */}
      <div className="relative">
        <AnimatePresence initial={false}>
          {activities.map((activity, index) => {
            const config = ACTIVITY_CONFIG[activity.type];
            const Icon = config.icon;
            const isLast = index === activities.length - 1;

            return (
              <motion.div
                key={activity.id}
                variants={slideIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="flex items-start gap-3 py-2.5">
                  <div className={`mt-0.5 shrink-0 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-[var(--foreground)]">{activity.text}</p>
                    <p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">{activity.relativeTime}</p>
                  </div>
                </div>
                {!isLast && <div className="glass-divider mx-2" />}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
