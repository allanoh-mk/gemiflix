'use client';

import React, { useCallback } from 'react';
import { Share2 } from 'lucide-react';
import { showCopiedToast } from '@/lib/toast';

interface ShareButtonProps {
  movieId: string;
  movieTitle: string;
}

export default function ShareButton({ movieId, movieTitle }: ShareButtonProps) {
  const handleShare = useCallback(() => {
    const url = `https://gemiflix.app/movie/${movieId}`;
    navigator.clipboard.writeText(url).then(() => {
      showCopiedToast(movieTitle);
    });
  }, [movieId, movieTitle]);

  return (
    <button
      onClick={handleShare}
      className="share-btn-pulse glass-chip flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] hover:bg-white/10"
      aria-label={`Share ${movieTitle}`}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}
