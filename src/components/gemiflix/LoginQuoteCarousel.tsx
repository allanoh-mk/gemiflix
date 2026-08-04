'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

interface MovieQuote {
  text: string;
  movie: string;
  year: number;
}

const quotes: MovieQuote[] = [
  { text: 'In the end, we only regret the chances we didn\'t take.', movie: 'Crimson Meridian', year: 2024 },
  { text: 'The walls have been listening all along.', movie: 'The Silent Architect', year: 2024 },
  { text: 'Memories and code intertwine until you can\'t tell where one ends and the other begins.', movie: 'Neon Requiem', year: 2023 },
  { text: 'Every great story begins with a single, reckless decision.', movie: 'Velocity', year: 2024 },
  { text: 'The deepest ocean hides the loudest silence.', movie: 'Abyssal', year: 2024 },
  { text: 'Not all who wander are lost. Some are just filming.', movie: 'The Grand Illusion', year: 2023 },
  { text: 'Time is the only currency that spends itself.', movie: 'Crimson Meridian', year: 2024 },
  { text: 'In the garden of shadows, even the flowers whisper.', movie: 'The Henna Diaries', year: 2024 },
  { text: 'Words are the most powerful weapon in the universe.', movie: 'Chatterbox', year: 2024 },
  { text: 'To drift among the stars, you must first learn to fall.', movie: 'Solaris Drift', year: 2024 },
];

export default function LoginQuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quote = quotes[currentIndex];

  return (
    <div className="login-quote-carousel mt-8 w-full max-w-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-card-inner-light rounded-xl px-5 py-4"
        >
          <Quote className="login-quote-icon mb-2 h-4 w-4 text-[var(--accent-current)] opacity-60" />
          <p className="login-quote-text mb-3 text-sm italic leading-relaxed text-[var(--foreground)] opacity-80">
            &ldquo;{quote.text}&rdquo;
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--accent-current)]">
              &mdash; {quote.movie}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {quote.year}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`login-quote-dot rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-6 h-1.5 bg-[var(--accent-current)]'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Quote ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
