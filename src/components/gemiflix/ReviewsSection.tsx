'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users } from 'lucide-react';

const REVIEWERS = [
  { name: 'Alex Chen', avatar: 'bg-purple-500' },
  { name: 'Sarah Miller', avatar: 'bg-pink-500' },
  { name: 'James Wilson', avatar: 'bg-cyan-500' },
  { name: 'Maria Garcia', avatar: 'bg-orange-500' },
  { name: 'David Kim', avatar: 'bg-green-500' },
  { name: 'Emma Taylor', avatar: 'bg-red-500' },
  { name: 'Ryan Park', avatar: 'bg-amber-500' },
  { name: 'Lisa Wang', avatar: 'bg-teal-500' },
  { name: 'Tom Brown', avatar: 'bg-indigo-500' },
  { name: 'Nina Patel', avatar: 'bg-rose-500' },
];

const REVIEW_TEXTS = [
  "Absolutely stunning cinematography and a gripping narrative that keeps you on the edge of your seat. One of the best I've seen this year.",
  'The performances were top-notch, especially the lead actor. The story had unexpected twists that made it unforgettable.',
  'A masterpiece of storytelling. The director really outdid themselves with this one. Highly recommend.',
  'Good but not great. The first half was incredible but it lost momentum in the third act. Still worth watching.',
  'Visually breathtaking with a soundtrack that perfectly complements every scene. A must-watch for any fan of the genre.',
  'I went in with high expectations and they were exceeded. The writing was sharp and the pacing was perfect.',
  "Decent movie overall. Some plot holes here and there but the acting makes up for it. Solid 7/10.",
  'This film is a work of art. Every frame is carefully composed and the attention to detail is remarkable.',
  'Entertaining from start to finish. The chemistry between the cast members was palpable. Would watch again.',
  'A thought-provoking piece that stays with you long after the credits roll. The ending was particularly powerful.',
];

const TIMESTAMPS = ['1h ago', '3h ago', '5h ago', '1d ago', '2d ago', '4d ago', '1w ago', '2w ago', '1mo ago', '3mo ago'];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

interface ReviewsSectionProps {
  movieId: string;
}

export default function ReviewsSection({ movieId }: ReviewsSectionProps) {
  const hash = simpleHash(movieId);

  // Pick 5 deterministic reviews
  const reviewCount = 5;
  const reviews = [];
  let totalRating = 0;

  for (let i = 0; i < reviewCount; i++) {
    const reviewerIdx = (hash + i * 3) % REVIEWERS.length;
    const textIdx = (hash + i * 7) % REVIEW_TEXTS.length;
    const timestampIdx = (hash + i * 5) % TIMESTAMPS.length;
    const rating = ((hash + i * 2) % 3) + 3; // ratings 3-5

    const reviewer = REVIEWERS[reviewerIdx];
    const initials = reviewer.name
      .split(' ')
      .map((n) => n[0])
      .join('');

    totalRating += rating;

    reviews.push({
      ...reviewer,
      initials,
      text: REVIEW_TEXTS[textIdx],
      timestamp: TIMESTAMPS[timestampIdx],
      rating,
    });
  }

  const avgRating = totalRating / reviewCount;

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <Users className="h-5 w-5 text-[var(--accent-current)]" />
        <h2 className="text-xl font-bold text-[var(--foreground)]">Audience Reviews</h2>
        <div className="flex items-center gap-1.5 rounded-full glass-chip px-3 py-1">
          <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
          <span className="text-sm font-semibold text-[var(--foreground)]">{avgRating.toFixed(1)}</span>
          <span className="text-xs text-[var(--muted-foreground)]">/ 5</span>
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {reviews.map((review, i) => (
          <motion.div
            key={`${movieId}-review-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="review-card glass-card p-4 rounded-xl"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${review.avatar} text-xs font-bold text-white`}
              >
                {review.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-[var(--foreground)]">{review.name}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{review.timestamp}</span>
                </div>

                {/* Stars */}
                <div className="review-stars flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= review.rating ? 'star-filled fill-current' : 'star-empty'}`}
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{review.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
