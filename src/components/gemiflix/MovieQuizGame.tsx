'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Movie } from '@/lib/mock-data';
import { movies } from '@/lib/mock-data';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Zap } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  movieTitle: string;
}

/* Simple deterministic hash for a string */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (s.charCodeAt(i) + ((h << 5) - h)) | 0;
  }
  return Math.abs(h);
}

/* Seeded random from a hash */
function seededRandom(seed: number, index: number): number {
  const v = hashStr(`${seed}-${index}`);
  return (v % 1000) / 1000;
}

/* Shuffle array deterministically */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed, i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* Pick an item from array by seeded index */
function seededPick<T>(arr: T[], seed: number, index: number): T {
  return arr[Math.floor(seededRandom(seed, index) * arr.length)];
}

const ALL_GENRES = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Horror', 'Comedy', 'Romance', 'Animation', 'Documentary', 'Fantasy'];

const FUN_MESSAGES = [
  '🎬 You truly are a cinephile!',
  '🌟 Ready for Hollywood trivia night!',
  '🏆 Impressive movie knowledge!',
  '🍿 You practically live at the cinema!',
  '🎭 Director material right here!',
];

function generateQuestions(movie: Movie): Question[] {
  const seed = hashStr(movie.id);
  const others = movies.filter(m => m.id !== movie.id);
  const questions: Question[] = [];

  // Question 1: "Which movie features [actor] in the cast?"
  const actor = movie.cast[seededRandom(seed, 100) < 0.5 ? 0 : 1];
  const actorMovies = movies.filter(m => m.cast.includes(actor));
  if (actorMovies.length >= 2) {
    const wrongOptions = others.filter(m => !m.cast.includes(actor));
    const wrongPicks = seededShuffle(wrongOptions, seed + 1).slice(0, 3).map(m => m.title);
    const correctTitle = movie.title;
    const options = seededShuffle([correctTitle, ...wrongPicks], seed + 2);
    questions.push({
      question: `Which movie features ${actor} in the cast?`,
      options,
      correctIndex: options.indexOf(correctTitle),
      movieTitle: movie.title,
    });
  }

  // Question 2: "What year was [movie] released?"
  {
    const yearOffsets = [-3, -2, -1, 0, 1, 2, 3].filter(y => movie.year + y > 2000 && movie.year + y <= 2025);
    const wrongYears = yearOffsets
      .filter(y => y !== 0)
      .slice(0, 3)
      .map(y => String(movie.year + y));
    const correctYear = String(movie.year);
    const options = seededShuffle([correctYear, ...wrongYears], seed + 3);
    questions.push({
      question: `What year was ${movie.title} released?`,
      options,
      correctIndex: options.indexOf(correctYear),
      movieTitle: movie.title,
    });
  }

  // Question 3: "Which genre does [movie] NOT belong to?"
  {
    const wrongGenres = ALL_GENRES.filter(g => !movie.genres.includes(g));
    if (wrongGenres.length >= 3) {
      const picks = seededShuffle(wrongGenres, seed + 4).slice(0, 3);
      const correctAnswer = picks[0];
      const oneRealGenre = movie.genres[seededRandom(seed, 5) < 0.5 ? 0 : 1];
      const options = seededShuffle([correctAnswer, oneRealGenre, ...picks.slice(1, 3)], seed + 5);
      questions.push({
        question: `Which genre does ${movie.title} NOT belong to?`,
        options,
        correctIndex: options.indexOf(correctAnswer),
        movieTitle: movie.title,
      });
    }
  }

  // Question 4: "What is the rating of [movie]?"
  {
    const ratingStr = movie.rating.toFixed(1);
    const otherRatings = others.map(m => m.rating.toFixed(1)).filter(r => r !== ratingStr);
    const uniqueRatings = [...new Set(otherRatings)];
    if (uniqueRatings.length >= 3) {
      const wrongPicks = seededShuffle(uniqueRatings, seed + 6).slice(0, 3);
      const options = seededShuffle([ratingStr, ...wrongPicks], seed + 7);
      questions.push({
        question: `What is the rating of ${movie.title}?`,
        options: options.map(o => `★ ${o}`),
        correctIndex: options.indexOf(ratingStr),
        movieTitle: movie.title,
      });
    }
  }

  // Question 5: "Who directed [movie]?"
  {
    const otherDirectors = others.map(m => m.director).filter(d => d !== movie.director);
    const uniqueDirectors = [...new Set(otherDirectors)];
    if (uniqueDirectors.length >= 3) {
      const wrongPicks = seededShuffle(uniqueDirectors, seed + 8).slice(0, 3);
      const options = seededShuffle([movie.director, ...wrongPicks], seed + 9);
      questions.push({
        question: `Who directed ${movie.title}?`,
        options,
        correctIndex: options.indexOf(movie.director),
        movieTitle: movie.title,
      });
    }
  }

  // Question 6: "How long is [movie]?" (skip for series with 0 duration)
  if (movie.duration > 0) {
    const otherDurations = others.filter(m => m.duration > 0).map(m => String(m.duration));
    const uniqueDurations = [...new Set(otherDurations)].filter(d => d !== String(movie.duration));
    if (uniqueDurations.length >= 3) {
      const wrongPicks = seededShuffle(uniqueDurations, seed + 10).slice(0, 3);
      const correctDur = String(movie.duration);
      const options = seededShuffle([correctDur, ...wrongPicks], seed + 11);
      questions.push({
        question: `How long is ${movie.title}?`,
        options: options.map(o => `${o} min`),
        correctIndex: options.indexOf(`${correctDur} min`),
        movieTitle: movie.title,
      });
    }
  }

  // Pick 4 deterministically
  return seededShuffle(questions, seed + 20).slice(0, 4);
}

export default function MovieQuizGame() {
  const [quizMovie] = useState<Movie>(() => {
    const idx = Math.floor(Math.random() * movies.length);
    return movies[idx];
  });

  const questions = useMemo(() => generateQuestions(quizMovie), [quizMovie]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult) return;
      setSelectedAnswer(index);
      setShowResult(true);
      if (index === currentQ.correctIndex) {
        setScore(s => s + 1);
      }
    },
    [showResult, currentQ]
  );

  const handleNext = useCallback(() => {
    if (currentQuestion + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestion, totalQuestions]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  }, []);

  const funMessage = FUN_MESSAGES[quizMovie.id.charCodeAt(3) % FUN_MESSAGES.length];

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="glass-card glass-deep w-full max-w-lg p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[var(--accent-current)]" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">Movie Quiz</h2>
          </div>
          <div className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-[var(--foreground)]">
            {score}/{totalQuestions} correct
          </div>
        </div>

        {/* Progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i < currentQuestion
                  ? 'bg-[var(--accent-current)]'
                  : i === currentQuestion
                    ? 'w-6 bg-[var(--accent-current)]'
                    : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!quizComplete && currentQ ? (
            <motion.div
              key={`q-${currentQuestion}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <p className="mb-5 text-sm font-medium leading-relaxed text-[var(--foreground)]">
                {currentQ.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, i) => {
                  const isCorrect = i === currentQ.correctIndex;
                  const isSelected = i === selectedAnswer;
                  let borderColor = 'border-white/5';
                  let bgColor = 'bg-white/3';

                  if (showResult) {
                    if (isCorrect) {
                      borderColor = 'border-green-500/50';
                      bgColor = 'bg-green-500/10';
                    } else if (isSelected && !isCorrect) {
                      borderColor = 'border-red-500/50';
                      bgColor = 'bg-red-500/10';
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.06 }}
                      onClick={() => handleSelect(i)}
                      disabled={showResult}
                      className={`press-scale flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all duration-200 ${borderColor} ${bgColor} ${!showResult ? 'hover:bg-white/6 hover:border-white/10' : 'cursor-default'}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-medium text-[var(--muted-foreground)]">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-[var(--foreground)]">{option}</span>
                      {showResult && isCorrect && <CheckCircle className="h-4 w-4 shrink-0 text-green-400" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
                    </motion.button>
                  );
                })}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="mt-5"
                >
                  <button
                    onClick={handleNext}
                    className="glass-button-liquid glass-button-shine w-full rounded-xl py-3 text-sm font-semibold text-[var(--foreground)]"
                  >
                    {currentQuestion + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Quiz complete */}
        <AnimatePresence>
          {quizComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                className="mb-4"
              >
                {score === totalQuestions ? (
                  <Trophy className="h-16 w-16 text-amber-400" />
                ) : (
                  <Zap className="h-16 w-16 text-[var(--accent-current)]" />
                )}
              </motion.div>

              <p className="mb-1 text-2xl font-black text-[var(--foreground)]">
                {score}/{totalQuestions}
              </p>
              <p className="mb-1 text-sm text-[var(--muted-foreground)]">
                {score === totalQuestions ? 'Perfect Score!' : score >= totalQuestions / 2 ? 'Great Job!' : 'Keep Watching!'}
              </p>
              <p className="mb-6 text-xs text-[var(--muted-foreground)]">{funMessage}</p>

              <button
                onClick={handleRestart}
                className="glass-button-liquid glass-button-shine press-scale flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                <RotateCcw className="h-4 w-4" />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
