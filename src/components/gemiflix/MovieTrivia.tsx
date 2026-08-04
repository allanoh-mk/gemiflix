'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Film } from 'lucide-react';

const triviaTemplates: string[] = [
  'This film was shot in 47 different locations across 3 continents',
  'The director insisted on using only natural lighting for 80% of the scenes',
  'The lead actor spent 6 months learning a specialized skill for this role',
  'The soundtrack features an original score by a Grammy-winning composer',
  'Over 2,500 visual effects shots were used in post-production',
  'The screenplay went through 14 drafts before final approval',
  'This movie holds the record for longest continuous take at 12 minutes',
  'The costume department created over 300 unique outfits',
  'Filming was temporarily halted for 2 weeks due to unprecedented weather',
  'The ending was kept secret from the cast until the final read-through',
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function getTriviaFacts(movieId: string): string[] {
  const facts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const hash = simpleHash(movieId + String(i)) % triviaTemplates.length;
    const fact = triviaTemplates[hash];
    if (!facts.includes(fact)) {
      facts.push(fact);
    }
  }
  return facts;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const childVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

interface MovieTriviaProps {
  movieId: string;
}

export default function MovieTrivia({ movieId }: MovieTriviaProps) {
  const facts = getTriviaFacts(movieId);

  return (
    <section className="relative w-full px-4 py-6 md:px-12" aria-label="Fun Facts">
      <div className="mb-5 flex items-center gap-3">
        <Lightbulb className="h-6 w-6 text-[var(--accent-current)]" />
        <h2 className="text-xl font-bold heading-shadow text-[var(--foreground)]">
          Fun Facts
        </h2>
      </div>

      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {facts.map((fact, index) => (
          <motion.div
            key={`${movieId}-fact-${index}`}
            variants={childVariants}
            className="glass-card flex items-start gap-3 rounded-xl p-4"
            style={{
              borderLeft: '3px solid var(--accent-current)',
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: 'color-mix(in srgb, var(--accent-current) 15%, transparent)',
              }}
            >
              {index % 2 === 0 ? (
                <Lightbulb className="h-4 w-4 text-[var(--accent-current)]" />
              ) : (
                <Film className="h-4 w-4 text-[var(--accent-current)]" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Did You Know?
              </span>
              <p className="text-sm leading-relaxed text-[var(--foreground)]">
                {fact}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
