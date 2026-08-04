'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Subtitles,
  Maximize,
  Minimize,
  X,
  MonitorPlay,
  Airplay,
  Settings,
} from 'lucide-react';
import { useAppStore } from '@/lib/stores/app-store';
import { usePlayerStore } from '@/lib/stores/player-store';
import { useWatchHistoryStore } from '@/lib/stores/watch-history-store';
import { pushNotification } from '@/components/gemiflix/NotificationBadge';
import { SkeletonPlayer } from '@/components/gemiflix/LoadingSkeleton';
import AudioVisualizer from '@/components/gemiflix/AudioVisualizer';
import MediaInfoOverlay from '@/components/gemiflix/MediaInfoOverlay';

type VolumeIcon = 'high' | 'low' | 'muted';

function getVolumeIcon(volume: number, isMuted: boolean): VolumeIcon {
  if (isMuted || volume === 0) return 'muted';
  if (volume < 0.5) return 'low';
  return 'high';
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const PROGRESS_STORAGE_KEY = 'gemiflix-player-progress';

function loadSavedProgress(movieId: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return 0;
    const map = JSON.parse(raw) as Record<string, number>;
    return map[movieId] ?? 0;
  } catch {
    return 0;
  }
}

function saveProgressToStorage(movieId: string, time: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[movieId] = time;
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // storage full or unavailable
  }
}

const qualityOptions = ['1080p', '720p', '480p'];

export default function VideoPlayer() {
  const selectedMovie = useAppStore((s) => s.selectedMovie);
  const setView = useAppStore((s) => s.setView);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    quality,
    isFullscreen,
    showSubtitles,
    showControls,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    setQuality,
    toggleFullscreen,
    toggleSubtitles,
    showControlsTemporarily,
    resetPlayer,
  } = usePlayerStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const qualityRef = useRef<HTMLDivElement>(null);
  const lastTime = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayingOverlay, setShowPlayingOverlay] = useState(false);
  const hasPlayingOverlayFired = useRef(false);

  // Loading state: show SkeletonPlayer for 1.5s
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [selectedMovie?.id]);

  // Center "playing" overlay: show for 1s when playback starts
  useEffect(() => {
    if (!isPlaying || hasPlayingOverlayFired.current) return;
    hasPlayingOverlayFired.current = true;
    setShowPlayingOverlay(true);
    const timer = setTimeout(() => setShowPlayingOverlay(false), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying]);

  // Reset playing overlay flag when movie changes
  useEffect(() => {
    hasPlayingOverlayFired.current = false;
    setShowPlayingOverlay(false);
  }, [selectedMovie?.id]);

  // Close volume slider when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(e.target as Node)) {
        setIsVolumeSliderOpen(false);
      }
    }
    if (isVolumeSliderOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVolumeSliderOpen]);

  // Restore saved progress when movie changes
  useEffect(() => {
    if (!selectedMovie) return;
    const saved = loadSavedProgress(selectedMovie.id);
    if (saved > 0 && duration === 0) {
      lastTime.current = saved;
    }
  }, [selectedMovie, duration]);

  // Set duration when movie changes
  useEffect(() => {
    if (selectedMovie && duration === 0) {
      const dur = selectedMovie.duration * 60;
      usePlayerStore.setState({ duration: dur });
      // Restore saved progress after duration is set
      const saved = loadSavedProgress(selectedMovie.id);
      if (saved > 0) {
        usePlayerStore.setState({ currentTime: saved });
        lastTime.current = saved;
      }
    }
  }, [selectedMovie, duration]);

  // Track currentTime and save to localStorage on unmount / play / seek
  useEffect(() => {
    if (!selectedMovie) return;
    if (Math.abs(currentTime - lastTime.current) > 1) {
      saveProgressToStorage(selectedMovie.id, currentTime);
      lastTime.current = currentTime;
    }
  }, [currentTime, selectedMovie]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (selectedMovie) {
        const { currentTime: ct } = usePlayerStore.getState();
        saveProgressToStorage(selectedMovie.id, ct);
      }
    };
  }, [selectedMovie]);

  // Save on seek
  useEffect(() => {
    if (!selectedMovie) return;
    const unsub = usePlayerStore.subscribe((state, prev) => {
      if (Math.abs(state.currentTime - prev.currentTime) > 2) {
        saveProgressToStorage(selectedMovie.id, state.currentTime);
      }
    });
    return unsub;
  }, [selectedMovie]);

  const handleClose = () => {
    if (selectedMovie) {
      const { currentTime: ct } = usePlayerStore.getState();
      saveProgressToStorage(selectedMovie.id, ct);
    }
    resetPlayer();
    setView('detail');
  };

  /* Track whether we've already recorded this play session */
  const hasRecordedRef = useRef(false);

  /* Record watch history + push notification when playback starts */
  useEffect(() => {
    if (!isPlaying || !selectedMovie || hasRecordedRef.current) return;
    hasRecordedRef.current = true;
    const progress = Math.floor(Math.random() * 80) + 10;
    useWatchHistoryStore.getState().addToHistory(selectedMovie, progress);
    pushNotification('played', selectedMovie.title);
  }, [isPlaying, selectedMovie]);

  /* Reset recorded flag when movie changes */
  useEffect(() => {
    hasRecordedRef.current = false;
  }, [selectedMovie?.id]);

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Simulate playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const { currentTime: ct, duration: dur } = usePlayerStore.getState();
      if (ct >= dur) {
        pause();
        return;
      }
      usePlayerStore.setState({ currentTime: ct + 1 });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, pause]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isPlaying) {
            pause();
          } else {
            play();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(duration, currentTime + 10));
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          handleClose();
          break;
      }
    },
    [isPlaying, pause, play, seek, currentTime, duration, toggleMute, toggleFullscreen],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Mouse movement for controls visibility
  const handleMouseMove = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // Close quality dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (qualityRef.current && !qualityRef.current.contains(e.target as Node)) {
        setIsQualityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Progress bar click/drag
  const handleProgressInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      seek(ratio * duration);
    },
    [duration, seek],
  );

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressInteraction(e);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => handleProgressInteraction(e);
    const handleUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, handleProgressInteraction]);

  // Volume bar click/drag
  const handleVolumeInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const rect = target.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      setVolume(ratio);
    },
    [setVolume],
  );

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVolumeDragging(true);
    handleVolumeInteraction(e);
  };

  useEffect(() => {
    if (!isVolumeDragging) return;
    const handleMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const slider = target.closest('[data-volume-slider]') as HTMLDivElement | null;
      if (slider) {
        const rect = slider.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setVolume(x / rect.width);
      }
    };
    const handleUp = () => setIsVolumeDragging(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isVolumeDragging, setVolume]);

  if (!selectedMovie) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volIcon = getVolumeIcon(volume, isMuted);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* SkeletonPlayer shown for 1.5s before content */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <SkeletonPlayer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Video Content Layer (hidden behind skeleton) ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5, delay: isLoading ? 0 : 0.05 }}
        className="absolute inset-0"
      >
        {/* Simulated video backdrop with slow zoom + opacity transition */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: isPlaying ? 0.6 : 0.3,
          }}
        >
          {selectedMovie.backdropImage ? (
            <img
              src={selectedMovie.backdropImage}
              alt=""
              className="h-full w-full object-cover"
              style={{
                animation: 'backdropSlowZoom 30s ease-in-out infinite alternate',
              }}
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: selectedMovie.backdropGradient,
                animation: 'backdropSlowZoom 30s ease-in-out infinite alternate',
              }}
            />
          )}
        </div>

        {/* Req 10: Vignette overlay — radial-gradient from center to edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Req 2: Gradient overlay at top of player */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: '25%',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
        />

        {/* Media info overlay — auto-hides after 3s when playing */}
        {selectedMovie && (
          <MediaInfoOverlay
            movie={selectedMovie}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
          />
        )}

        {/* Equalizer animation when playing */}
        {isPlaying && !isLoading && !showPlayingOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-end gap-1 h-24">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1.5 rounded-full bg-white/20"
                  animate={{
                    height: [
                      12,
                      40 + Math.random() * 56,
                      16,
                      32 + Math.random() * 48,
                      12,
                    ],
                  }}
                  transition={{
                    duration: 1.2 + Math.random() * 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: bar * 0.08,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Req 2: Center "Playing" overlay — pulsing Play icon, glass-deep bg, fades out after 1s */}
        <AnimatePresence>
          {showPlayingOverlay && (
            <motion.div
              key="playing-overlay"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <div
                className="glass-deep flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  animation: 'playingPulse 0.8s ease-in-out infinite',
                }}
              >
                <Play className="h-14 w-14 fill-white text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Large centered play button (visible when paused) */}
        <AnimatePresence>
          {!isPlaying && !isLoading && !showPlayingOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <button
                onClick={togglePlay}
                className="glass-button-shine flex h-20 w-20 items-center justify-center rounded-full glass-panel transition-transform hover:scale-110 md:h-24 md:w-24"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <Play className="h-10 w-10 fill-white text-white md:h-12 md:w-12" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Req 1 + 8: Top Control Bar — glass-deep, accent line, quality badge ===== */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-x-0 top-0 z-10"
            >
              {/* glass-deep background bar */}
              <div className="glass-deep flex items-start justify-between p-4 md:p-6 rounded-none border-x-0 border-t-0"
                style={{
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderBottomLeftRadius: '0',
                  borderBottomRightRadius: '0',
                }}
              >
                <div className="flex items-center gap-3">
                  <MonitorPlay className="h-5 w-5 text-white/50" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                      Now Playing
                    </p>
                    <h2 className="mt-0.5 text-base font-bold text-white md:text-lg">
                      {selectedMovie.title}
                    </h2>
                    <AudioVisualizer isPlaying={isPlaying} barCount={16} height={24} className="ml-3 hidden md:flex" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Req 8: Quality badge in top-right with glass-chip + premium-badge */}
                  <span className="glass-chip premium-badge text-white/80">
                    {quality} HD
                  </span>

                  <button
                    onClick={handleClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                    aria-label="Close player"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Thin accent-colored line at bottom of top bar */}
              <div
                className="h-px w-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, var(--accent-current), transparent)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Req 9: "Now Playing" bar above bottom controls with text-glow ===== */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.08,
              }}
              className="absolute inset-x-0 bottom-[180px] z-10 px-4 md:bottom-[200px] md:px-6 pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <motion.span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent-current)' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span
                  className="text-sm font-semibold text-white/80 text-glow"
                  style={{
                    animation: 'breatheGlow 3s ease-in-out infinite',
                  }}
                >
                  {selectedMovie.title}
                </span>
                <span className="text-xs text-white/30">•</span>
                <span className="text-xs text-white/40">
                  {selectedMovie.year} • {selectedMovie.genres?.[0] ?? 'Drama'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Req 3 + 4 + 5 + 6 + 7: Enhanced Bottom Controls ===== */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-x-0 bottom-0 z-10"
            >
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

              {/* Req 3: Thin glass-deep strip at bottom */}
              <div
                className="relative px-4 pb-4 pt-12 md:px-6 md:pb-6 md:pt-16"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 100%)',
                }}
              >
                {/* Req 4: Time display on both sides of progress bar */}
                {/* Progress bar - with progress-bar-glow and circular thumb */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Current time — left side */}
                  <span className="text-[11px] font-mono font-medium text-white/60 min-w-[44px] text-right">
                    {formatTime(currentTime)}
                  </span>

                  <div
                    ref={progressRef}
                    className="group relative flex-1 h-1.5 cursor-pointer rounded-full bg-white/15 transition-all duration-200 hover:h-2.5"
                    onClick={handleProgressInteraction}
                    onMouseDown={handleProgressMouseDown}
                    role="slider"
                    aria-label="Video progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    tabIndex={0}
                  >
                    {/* Buffered indicator (visual only) */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-white/10"
                      style={{
                        width: `${Math.min(progress + 15, 100)}%`,
                      }}
                    />
                    {/* Req 3: Progress fill with progress-bar-glow */}
                    <motion.div
                      className="progress-bar-glow absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: 'var(--accent-current)',
                        width: `${progress}%`,
                      }}
                      layout={false}
                    />
                    {/* Req 3: Small circular thumb (w-3 h-3) with accent glow */}
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      style={{
                        left: `${progress}%`,
                        boxShadow:
                          '0 0 6px var(--accent-current), 0 0 14px color-mix(in srgb, var(--accent-current) 50%, transparent), 0 0 24px color-mix(in srgb, var(--accent-current) 25%, transparent)',
                      }}
                    />
                  </div>

                  {/* Total time — right side */}
                  <span className="text-[11px] font-mono font-medium text-white/60 min-w-[44px]">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left controls */}
                  <div className="flex items-center gap-1.5 md:gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="glass-button-shine flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 fill-white text-white" />
                      )}
                    </button>

                    {/* Skip Back 10s */}
                    <button
                      onClick={() => seek(Math.max(0, currentTime - 10))}
                      className="flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                      aria-label="Rewind 10 seconds"
                    >
                      <SkipBack className="h-4 w-4 text-white" />
                    </button>

                    {/* Skip Forward 10s */}
                    <button
                      onClick={() => seek(Math.min(duration, currentTime + 10))}
                      className="flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                      aria-label="Forward 10 seconds"
                    >
                      <SkipForward className="h-4 w-4 text-white" />
                    </button>

                    {/* Req 5: Volume control — icon toggles glass-chip slider */}
                    <div className="relative flex items-center" ref={volumeSliderRef}>
                      <button
                        onClick={() => {
                          toggleMute();
                          setIsVolumeSliderOpen((prev) => !prev);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {volIcon === 'high' && <Volume2 className="h-4 w-4 text-white" />}
                        {volIcon === 'low' && <Volume1 className="h-4 w-4 text-white" />}
                        {volIcon === 'muted' && <VolumeX className="h-4 w-4 text-white" />}
                      </button>

                      {/* Expandable volume slider — glass-chip style */}
                      <AnimatePresence>
                        {isVolumeSliderOpen && (
                          <motion.div
                            initial={{ opacity: 0, width: 0, x: -4 }}
                            animate={{ opacity: 1, width: 100, x: 0 }}
                            exit={{ opacity: 0, width: 0, x: -4 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="ml-1.5 flex items-center gap-2 overflow-hidden"
                          >
                            <div
                              data-volume-slider
                              className="glass-chip relative h-6 flex-1 cursor-pointer rounded-full overflow-hidden"
                              onMouseDown={handleVolumeMouseDown}
                            >
                              <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all"
                                style={{
                                  background: 'var(--accent-current)',
                                  width: `${isMuted ? 0 : volume * 100}%`,
                                }}
                              />
                              {/* Thumb */}
                              <div
                                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                                style={{
                                  left: `${isMuted ? 0 : volume * 100}%`,
                                  boxShadow:
                                    '0 0 4px var(--accent-current)',
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-white/50 min-w-[28px]">
                              {Math.round((isMuted ? 0 : volume) * 100)}%
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Airplay / Cast icon */}
                    <button
                      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                      aria-label="Cast to device"
                    >
                      <Airplay className="h-4 w-4 text-white/70" />
                    </button>

                    {/* Settings icon */}
                    <button
                      className="hidden md:flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                      aria-label="Player settings"
                    >
                      <Settings className="h-4 w-4 text-white/70" />
                    </button>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-1.5 md:gap-2">
                    {/* Subtitle toggle */}
                    <button
                      onClick={toggleSubtitles}
                      className={`flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
                        showSubtitles ? 'bg-[var(--accent-current)]/30' : ''
                      }`}
                      aria-label={showSubtitles ? 'Disable subtitles' : 'Enable subtitles'}
                    >
                      <Subtitles className="h-4 w-4 text-white" />
                    </button>

                    {/* Quality selector */}
                    <div className="relative" ref={qualityRef}>
                      <button
                        onClick={() => setIsQualityOpen(!isQualityOpen)}
                        className="glass-chip premium-badge flex h-9 items-center justify-center rounded-full px-3 transition-all duration-300 hover:scale-105"
                        aria-label="Select quality"
                      >
                        <span className="text-xs font-semibold text-white">
                          {quality}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isQualityOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-xl glass-deep py-1"
                          >
                            {qualityOptions.map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setQuality(q);
                                  setIsQualityOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-2 text-xs font-medium transition-colors duration-200 hover:bg-white/10 ${
                                  quality === q
                                    ? 'text-[var(--accent-current)]'
                                    : 'text-white/70'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Req 7: Fullscreen button — always visible via separate layer below */}
                    {/* Shown here inside controls for visual grouping */}
                    <button
                      onClick={toggleFullscreen}
                      className="glass-button-shine flex h-9 w-9 items-center justify-center rounded-full glass-panel transition-all duration-300 hover:scale-110 hover:bg-white/10"
                      aria-label={
                        isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                      }
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4 text-white" />
                      ) : (
                        <Maximize className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Req 7: Always-visible fullscreen button (shown when controls are hidden) */}
        <AnimatePresence>
          {!showControls && !isLoading && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              onClick={toggleFullscreen}
              className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              aria-label={
                isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
              }
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5 text-white/70" />
              ) : (
                <Maximize className="h-5 w-5 text-white/70" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes backdropSlowZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.12);
          }
        }
        @keyframes playingPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px color-mix(in srgb, var(--accent-current) 30%, transparent);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 60px color-mix(in srgb, var(--accent-current) 50%, transparent), 0 0 100px color-mix(in srgb, var(--accent-current) 20%, transparent);
          }
        }
        @keyframes breatheGlow {
          0%, 100% {
            opacity: 0.6;
            text-shadow: 0 0 12px color-mix(in srgb, var(--accent-current) 30%, transparent);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 24px color-mix(in srgb, var(--accent-current) 60%, transparent), 0 0 48px color-mix(in srgb, var(--accent-current) 25%, transparent);
          }
        }
      `}</style>
    </motion.div>
  );
}
