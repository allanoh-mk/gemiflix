'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Search, Bookmark, BarChart3, PartyPopper } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { LucideIcon } from 'lucide-react';

const STORAGE_KEY = 'gemiflix-onboarding-done';
const SHOW_DELAY_MS = 1500;
const TOTAL_STEPS = 6;

interface TourStep {
  title: string;
  description: string;
  icon: LucideIcon;
  isCenter?: boolean;
  animatedTitle?: boolean;
}

const STEPS: TourStep[] = [
  {
    title: 'Welcome to GemiFlix',
    description: 'Premium streaming experience — discover, watch, and track your favorite movies and shows all in one place.',
    icon: Sparkles,
    isCenter: true,
    animatedTitle: true,
  },
  {
    title: 'Browse by Mood',
    description: 'Not sure what to watch? Pick a mood and we\'ll curate the perfect selection for how you\'re feeling right now.',
    icon: Sparkles,
  },
  {
    title: 'Quick Search',
    description: 'Find any movie or show instantly. Use advanced filters for genre, year, rating, and more to narrow down results.',
    icon: Search,
  },
  {
    title: 'Your Watchlist',
    description: 'Bookmark movies and shows to your personal list. Never lose track of what you want to watch next.',
    icon: Bookmark,
  },
  {
    title: 'Track Your Stats',
    description: 'View detailed watch statistics — total time watched, genre breakdown, viewing streaks, and personalized insights.',
    icon: BarChart3,
  },
  {
    title: "You're All Set!",
    description: 'Start exploring our curated library. Press "/" anytime to search, or "Esc" to go back. Enjoy the show!',
    icon: PartyPopper,
    isCenter: true,
    animatedTitle: true,
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
    scale: 0.96,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -60 : 60,
    scale: 0.96,
  }),
};

export default function OnboardingTour() {
  const currentStepRef = useRef(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState(1);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const dismissingRef = useRef(false);

  const isTourDone = useCallback((): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return true;
    }
  }, []);

  const markTourDone = useCallback((): void => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // storage unavailable
    }
  }, []);

  const dismiss = useCallback(() => {
    dismissingRef.current = true;
    markTourDone();
    setIsVisible(false);
  }, [markTourDone]);

  useEffect(() => {
    if (!isAuthenticated || isTourDone()) return;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isTourDone]);

  const goNext = useCallback(() => {
    if (dismissingRef.current) return;
    const step = currentStepRef.current;
    if (step >= TOTAL_STEPS - 1) {
      dismiss();
      return;
    }
    setDirection(1);
    const next = step + 1;
    currentStepRef.current = next;
    setCurrentStep(next);
  }, [dismiss]);

  const goBack = useCallback(() => {
    if (dismissingRef.current) return;
    const step = currentStepRef.current;
    if (step <= 0) return;
    setDirection(-1);
    const prev = step - 1;
    currentStepRef.current = prev;
    setCurrentStep(prev);
  }, []);

  // Sync ref
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  const isFirst = currentStep === 0;
  const isLast = currentStep === TOTAL_STEPS - 1;
  const safeStep = Math.min(Math.max(currentStep, 0), TOTAL_STEPS - 1);
  const step = STEPS[safeStep];
  const StepIcon = step.icon;

  if (!isVisible && isTourDone()) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="tour-backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`tour-step-${safeStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-4 w-full max-w-sm"
            >
              <div className="glass-deep p-6 space-y-4">
                {/* Step counter + icon row */}
                <div className="flex items-center justify-between">
                  <span className="glass-chip">
                    {safeStep + 1}/{TOTAL_STEPS}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-current)]/10">
                    <StepIcon className="h-4 w-4 text-[var(--accent-current)]" />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-lg font-bold ${step.animatedTitle ? 'text-gradient-animated' : 'text-[var(--foreground)]'}`}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {step.description}
                </p>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  {!isFirst ? (
                    <button
                      onClick={goBack}
                      className="glass-button-shine press-scale flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-transparent px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={goNext}
                    className="glass-button-liquid press-scale rounded-lg px-4 py-2 text-sm font-bold text-white"
                    style={{ background: 'var(--accent-current)' }}
                  >
                    {isLast ? 'Get Started' : 'Next'}
                    {!isLast && <ChevronRight className="ml-1.5 h-4 w-4" />}
                  </button>
                </div>

                {/* Skip tour link */}
                <div className="pt-1 text-center">
                  <button
                    onClick={dismiss}
                    className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Skip Tour
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
