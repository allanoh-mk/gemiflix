'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Trash2, Check, Pause, Play } from 'lucide-react';

interface DownloadItem {
  id: string;
  title: string;
  progress: number;
  status: 'downloading' | 'paused' | 'complete';
  speed: string;
}

const SEED_DOWNLOADS: DownloadItem[] = [
  { id: 'dl-1', title: 'Crimson Meridian', progress: 0, status: 'downloading', speed: '12.4 MB/s' },
  { id: 'dl-2', title: 'The Silent Architect', progress: 0, status: 'downloading', speed: '8.7 MB/s' },
  { id: 'dl-3', title: 'Neon Requiem', progress: 0, status: 'paused', speed: '0 B/s' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: typeof Download }> = {
  downloading: { label: 'Downloading', color: 'text-[var(--accent-current)]', Icon: Download },
  paused: { label: 'Paused', color: 'text-amber-400', Icon: Pause },
  complete: { label: 'Complete', color: 'text-green-400', Icon: Check },
};

export default function DownloadManager() {
  const [expanded, setExpanded] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>(SEED_DOWNLOADS);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((item) => {
          if (item.status === 'complete') return item;
          if (item.status === 'paused') return item;
          const increment = Math.random() * 3 + 0.5;
          const newProgress = Math.min(item.progress + increment, 100);
          const isComplete = newProgress >= 100;
          const speedVal = (Math.random() * 15 + 5).toFixed(1);
          return {
            ...item,
            progress: newProgress,
            status: isComplete ? ('complete' as const) : ('downloading' as const),
            speed: isComplete ? '0 B/s' : `${speedVal} MB/s`,
          };
        }),
      );
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const activeCount = downloads.filter((d) => d.status !== 'complete').length;
  const completedCount = downloads.filter((d) => d.status === 'complete').length;

  const togglePause = useCallback((id: string) => {
    setDownloads((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === 'complete') return item;
        const next = item.status === 'paused' ? 'downloading' : 'paused';
        return {
          ...item,
          status: next,
          speed: next === 'paused' ? '0 B/s' : `${(Math.random() * 15 + 5).toFixed(1)} MB/s`,
        };
      }),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setDownloads((prev) => prev.filter((d) => d.status !== 'complete'));
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  return (
    <div ref={panelRef} className="fixed bottom-20 right-4 z-40 sm:right-6 sm:bottom-24">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-panel mb-3 w-80 overflow-hidden rounded-2xl sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-[var(--accent-current)]" />
                <h3 className="text-sm font-semibold text-white">Downloads</h3>
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/50">
                  {downloads.length}
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                aria-label="Close downloads"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto scrollbar-glass">
              {downloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                  <Download className="h-6 w-6 text-white/15" />
                  <p className="text-xs text-white/30">No active downloads</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {downloads.map((item) => {
                    const cfg = STATUS_CONFIG[item.status];
                    const StatusIcon = cfg.Icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group flex items-start gap-3 border-b border-white/[0.03] px-4 py-3 last:border-b-0"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                          <StatusIcon className={`h-3.5 w-3.5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-white/80">{item.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`text-[11px] ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-[11px] text-white/30">{item.speed}</span>
                            <span className="text-[11px] text-white/30">{Math.round(item.progress)}%</span>
                          </div>
                          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className={`h-full rounded-full ${item.status === 'complete' ? 'bg-green-400' : 'progress-bar-glow'}`}
                              style={{
                                width: `${item.progress}%`,
                                background: item.status === 'complete' ? undefined : 'var(--accent-current)',
                              }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                        {item.status !== 'complete' && (
                          <button
                            onClick={() => togglePause(item.id)}
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/0 transition-colors group-hover:text-white/40 hover:text-white/70"
                            aria-label={item.status === 'paused' ? 'Resume' : 'Pause'}
                          >
                            {item.status === 'paused' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {completedCount > 0 && (
              <div className="border-t border-white/5 px-4 py-2.5">
                <button
                  onClick={clearCompleted}
                  className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear {completedCount} completed
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="glass-panel magnetic-glow relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl"
        aria-label={expanded ? 'Close downloads' : 'Open downloads'}
      >
        <Download className="h-5 w-5 text-[var(--accent-current)]" />
        {activeCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent-current)] px-1 text-[10px] font-bold leading-none text-white"
          >
            {activeCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
