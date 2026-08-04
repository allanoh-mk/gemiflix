'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useThemeStore } from '@/lib/stores/theme-store';
import { movies, genres, categories, featuredMovies, seriesList } from '@/lib/mock-data';

import LoginScreen from '@/components/gemiflix/LoginScreen';
import Navbar from '@/components/gemiflix/Navbar';
import HeroSection from '@/components/gemiflix/HeroSection';
import ContinueWatching from '@/components/gemiflix/ContinueWatching';
import MovieOfTheDay from '@/components/gemiflix/MovieOfTheDay';
import CuratedCollections from '@/components/gemiflix/CuratedCollections';
import MoodDiscovery from '@/components/gemiflix/MoodDiscovery';
import ComingSoon from '@/components/gemiflix/ComingSoon';
import GenreFilter from '@/components/gemiflix/GenreFilter';
import CategoryRail from '@/components/gemiflix/CategoryRail';
import MovieCard from '@/components/gemiflix/MovieCard';
import MovieDetail from '@/components/gemiflix/MovieDetail';
import VideoPlayer from '@/components/gemiflix/VideoPlayer';
import SearchResults from '@/components/gemiflix/SearchResults';
import AdvancedSearchFilters from '@/components/gemiflix/AdvancedSearchFilters';
import SettingsPage from '@/components/gemiflix/SettingsPage';
import MyListView from '@/components/gemiflix/MyListView';
import ActorSpotlight from '@/components/gemiflix/ActorSpotlight';
import TopCharts from '@/components/gemiflix/TopCharts';
import KeyboardShortcuts from '@/components/gemiflix/KeyboardShortcuts';
import ErrorBoundary from '@/components/gemiflix/ErrorBoundary';
import ScrollProgressBar from '@/components/gemiflix/ScrollProgressBar';
import { Film, Tv, Sparkles, Flame, Clock, Star, Clapperboard, TrendingUp } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeInOut' } },
};

export default function HomePage() {
  const view = useAppStore((s) => s.view);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const applyTheme = useThemeStore((s) => s.applyTheme);
  const checkSession = useAuthStore((s) => s.checkSession);
  const user = useAuthStore((s) => s.user);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    applyTheme();
    checkSession();
  }, [applyTheme, checkSession]);

  // Apply user's accent color when it changes
  useEffect(() => {
    if (user?.accentColor) {
      useThemeStore.getState().setAccentColor(user.accentColor);
    }
  }, [user?.accentColor]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-4xl font-bold text-shimmer mb-4"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            GemiFlix
          </motion.div>
          <div className="w-48 h-1 mx-auto rounded-full overflow-hidden bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent-current)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgressBar />

      <AnimatePresence>
        {view === 'player' && <VideoPlayer />}
      </AnimatePresence>

      <KeyboardShortcuts />

      <ErrorBoundary>
        {!isAuthenticated && (
          <AnimatePresence mode="wait">
            <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <LoginScreen />
            </motion.div>
          </AnimatePresence>
        )}

        {isAuthenticated && (
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
              <AnimatePresence mode="wait">
                {view === 'dashboard' && (
                  <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <DashboardView />
                  </motion.div>
                )}

                {view === 'watchlist' && (
                  <motion.div key="watchlist" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <MyListView />
                  </motion.div>
                )}

                {view === 'search' && (
                  <motion.div key="search" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <SearchView />
                  </motion.div>
                )}

                {view === 'detail' && (
                  <motion.div key={`detail-${useAppStore.getState().selectedMovie?.id ?? 'none'}`} variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <MovieDetail />
                  </motion.div>
                )}

                {view === 'actor' && (
                  <motion.div key={`actor-${useAppStore.getState().selectedActor ?? 'none'}`} variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <ActorSpotlightView />
                  </motion.div>
                )}

                {view === 'settings-page' && (
                  <motion.div key="settings-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <SettingsPage />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        )}
      </ErrorBoundary>
    </>
  );
}

/* Search View */
function SearchView() {
  return (
    <div className="relative z-10">
      <div className="px-4 md:px-8 lg:px-12">
        <AdvancedSearchFilters
          onFilterApply={(filters) => {
            let results = [...movies];
            if (filters.type === 'movie') results = results.filter(m => m.type === 'movie');
            else if (filters.type === 'series') results = results.filter(m => m.type === 'series');
            results = results.filter(m => m.year >= filters.yearRange[0] && m.year <= filters.yearRange[1]);
            results = results.filter(m => m.rating >= filters.ratingRange[0] && m.rating <= filters.ratingRange[1]);
            if (filters.sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
            else if (filters.sortBy === 'year') results.sort((a, b) => b.year - a.year);
            else if (filters.sortBy === 'title') results.sort((a, b) => a.title.localeCompare(b.title));
            else if (filters.sortBy === 'duration') results.sort((a, b) => b.duration - a.duration);
            useAppStore.getState().cacheSearchResults('__advanced__', results);
          }}
          onReset={() => {}}
        />
      </div>
      <SearchResults />
    </div>
  );
}

/* Actor Spotlight View */
function ActorSpotlightView() {
  const selectedActor = useAppStore((s) => s.selectedActor);
  if (!selectedActor) return null;
  const actorMovies = movies.filter(m => m.cast.includes(selectedActor));
  return <ActorSpotlight actorName={selectedActor} movies={actorMovies} />;
}

/* Dashboard View */
function DashboardView() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const moodFilteredMovies = useAppStore((s) => s.moodFilteredMovies);
  const moodFilterName = useAppStore((s) => s.moodFilterName);
  const clearMoodFilter = useAppStore((s) => s.clearMoodFilter);

  const handleFilterChange = (genre: string | null) => {
    setActiveGenre(genre);
  };

  const handleMoodSelect = (filteredMovies: typeof movies, moodName: string) => {
    useAppStore.getState().setMoodFilter(filteredMovies, moodName);
    setActiveGenre(null);
  };

  const filteredMovies = activeGenre
    ? movies.filter((m) => m.genres.includes(activeGenre))
    : [];

  const showMoodGrid = moodFilteredMovies && moodFilteredMovies.length > 0;
  const showGenreGrid = !showMoodGrid && activeGenre && filteredMovies.length > 0;
  const showDefaultRails = !showMoodGrid && !showGenreGrid && !activeGenre;

  return (
    <div className="pb-8">
      <HeroSection />

      <div className="relative z-10 -mt-12 px-4 md:px-8 lg:px-12">
        <BentoStats />
      </div>

      <div className="relative z-10 mt-6">
        <ContinueWatching />
      </div>

      <MovieOfTheDay />

      <div className="relative z-10 mt-6 mb-6">
        <GenreFilter onFilterChange={handleFilterChange} activeGenre={activeGenre} />
      </div>

      <div className="relative z-10 mb-8 px-4 md:px-8 lg:px-12">
        <MoodDiscovery onMoodSelect={handleMoodSelect} />
      </div>

      <ComingSoon />
      <CuratedCollections />
      <TopCharts />

      {/* Mood-filtered grid */}
      {showMoodGrid && (
        <motion.div
          key={`mood-${moodFilterName}`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 px-4 md:px-8 lg:px-12"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[var(--foreground)]">{moodFilterName}</span>
              <span className="text-sm text-[var(--muted-foreground)]">{moodFilteredMovies.length} titles</span>
            </div>
            <button onClick={clearMoodFilter} className="glass-chip px-3 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Clear</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {moodFilteredMovies.map((movie, idx) => <MovieCard key={movie.id} movie={movie} index={idx} />)}
          </div>
        </motion.div>
      )}

      {/* Genre-filtered grid */}
      {showGenreGrid && (
        <motion.div
          key={`grid-${activeGenre}`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 px-4 md:px-8 lg:px-12"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg font-semibold text-[var(--foreground)]">{activeGenre}</span>
            <span className="text-sm text-[var(--muted-foreground)]">{filteredMovies.length} titles</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie, idx) => <MovieCard key={movie.id} movie={movie} index={idx} />)}
          </div>
        </motion.div>
      )}

      {/* Empty genre state */}
      {activeGenre && filteredMovies.length === 0 && !showMoodGrid && (
        <div className="relative z-10 flex flex-col items-center justify-center py-20">
          <p className="text-[var(--muted-foreground)]">No movies found in &ldquo;{activeGenre}&rdquo;</p>
        </div>
      )}

      {/* Default category rails */}
      {showDefaultRails && (
        <div className="relative z-10 -mt-4 space-y-10 px-4 md:px-8 lg:px-12">
          <CategoryRail title="Trending Now" movies={featuredMovies} icon={<Flame className="w-5 h-5 text-[var(--accent-current)]" />} />
          <CategoryRail title="Top Rated" movies={[...movies].sort((a, b) => b.rating - a.rating).slice(0, 12)} icon={<Star className="w-5 h-5 text-yellow-500" />} />
          <CategoryRail title="New Releases" movies={movies.filter((m) => m.year === 2024).slice(0, 12)} icon={<Sparkles className="w-5 h-5 text-[var(--accent-current)]" />} />
          <CategoryRail title="TV Series" movies={seriesList} icon={<Tv className="w-5 h-5 text-[var(--accent-current)]" />} />
          {genres.slice(0, 6).map((genre) => {
            const genreMovies = categories[genre] || [];
            if (genreMovies.length === 0) return null;
            return <CategoryRail key={genre} title={genre} movies={genreMovies} icon={getGenreIcon(genre)} />;
          })}
          <CategoryRail title="Recently Added" movies={[...movies].reverse().slice(0, 12)} icon={<Clock className="w-5 h-5 text-[var(--accent-current)]" />} />
          <CategoryRail title="Fan Favorites" movies={[...movies].sort((a, b) => b.rating - a.rating).filter(m => m.rating >= 8.0)} icon={<TrendingUp className="w-5 h-5 text-[var(--accent-current)]" />} />
        </div>
      )}
    </div>
  );
}

function getGenreIcon(genre: string) {
  const iconMap: Record<string, React.ReactNode> = {
    Action: <Clapperboard className="w-5 h-5 text-red-400" />,
    'Sci-Fi': <Sparkles className="w-5 h-5 text-cyan-400" />,
    Drama: <Film className="w-5 h-5 text-amber-400" />,
    Thriller: <Flame className="w-5 h-5 text-orange-400" />,
    Horror: <Flame className="w-5 h-5 text-red-500" />,
    Comedy: <Star className="w-5 h-5 text-yellow-400" />,
    Romance: <Sparkles className="w-5 h-5 text-pink-400" />,
    Animation: <Sparkles className="w-5 h-5 text-green-400" />,
    Documentary: <Film className="w-5 h-5 text-blue-400" />,
    Fantasy: <Sparkles className="w-5 h-5 text-purple-400" />,
  };
  return iconMap[genre] || <Film className="w-5 h-5 text-[var(--accent-current)]" />;
}

/* Inline BentoStats */
function BentoStats() {
  const totalMovies = movies.length;
  const avgRating = (movies.reduce((s, m) => s + m.rating, 0) / totalMovies).toFixed(1);
  const allGenres = new Set(movies.flatMap(m => m.genres));
  const totalSeries = movies.filter(m => m.type === 'series').length;

  const stats = [
    { label: 'Total Titles', value: totalMovies, icon: Film, color: 'text-[var(--accent-current)]' },
    { label: 'Avg Rating', value: `${avgRating}★`, icon: Star, color: 'text-yellow-400' },
    { label: 'Genres', value: allGenres.size, icon: Sparkles, color: 'text-cyan-400' },
    { label: 'TV Series', value: totalSeries, icon: Tv, color: 'text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className="glass-card p-4 group cursor-default"
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs text-[var(--muted-foreground)]">{stat.label}</span>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
