'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBadge from '@/components/gemiflix/NotificationBadge';
import SearchSuggestions from '@/components/gemiflix/SearchSuggestions';
import { Play, Search, X, Settings, LogOut, Bookmark, Home, Film, Compass, Keyboard, Download, ChevronDown, Shield, User, ArrowRightLeft } from 'lucide-react';
import { useAuthStore, type UserProfile } from '@/lib/stores/auth-store';
import { useAppStore } from '@/lib/stores/app-store';
import { useWatchlistStore } from '@/lib/stores/watchlist-store';

const PROFILE_COLORS = [
  'bg-purple-500', 'bg-cyan-500', 'bg-orange-500', 'bg-pink-500',
  'bg-green-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PROFILE_COLORS[Math.abs(hash) % PROFILE_COLORS.length];
}

const NAV_ITEMS = [
  { icon: Home, label: 'Home', view: 'dashboard' as const },
  { icon: Film, label: 'Movies', view: 'dashboard' as const },
  { icon: Compass, label: 'Discover', view: 'dashboard' as const },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const switchProfile = useAuthStore((s) => s.switchProfile);
  const fetchProfiles = useAuthStore((s) => s.fetchProfiles);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const setSearch = useAppStore((s) => s.setSearch);
  const watchlistCount = useWatchlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) searchInputRef.current.focus();
  }, [searchExpanded]);

  // Close menus on outside click
  useEffect(() => {
    if (!showShortcuts) return;
    const handler = () => setShowShortcuts(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showShortcuts]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  // Fetch profiles for switching
  useEffect(() => {
    if (showUserMenu) {
      fetchProfiles().then(() => {
        setProfiles(useAuthStore.getState().profiles);
      }).catch(() => {});
    }
  }, [showUserMenu, fetchProfiles]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      setShowSuggestions(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearch(value), 300);
    },
    [setSearch]
  );

  const handleSuggestionSelect = useCallback(
    (query: string) => {
      setSearchValue(query);
      setShowSuggestions(false);
      setSearch(query);
    },
    [setSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchValue('');
    setSearch('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [setSearch]);

  const handleLogout = useCallback(async () => {
    setShowUserMenu(false);
    await logout();
    setView('login');
  }, [logout, setView]);

  const handleProfileSwitch = useCallback(async (userId: string) => {
 setShowUserMenu(false);
    try {
      await switchProfile(userId);
      window.location.reload();
    } catch {
      // handled by store
    }
  }, [switchProfile]);

  const handleLogoClick = useCallback(() => setView('dashboard'), [setView]);
  const handleMyListClick = useCallback(() => setView('watchlist'), [setView]);
  const toggleMobileSearch = useCallback(() => setSearchExpanded(p => !p), []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'glass-panel-strong border-b border-[var(--glass-border)] shadow-[0_1px_0_0_color-mix(in_srgb,var(--accent-current)_8%,transparent)]'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Logo + Nav Items */}
        <div className="flex items-center gap-6">
          <button onClick={handleLogoClick} className="flex items-center gap-2 shrink-0" aria-label="GemiFlix Home">
            <Play className="h-5 w-5 text-[var(--accent-current)]" />
            <span className="text-gradient-animated text-xl font-bold tracking-tight">GemiFlix</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 press-scale ${
                  view === item.view
                    ? 'text-[var(--foreground)] bg-white/10 shadow-[inset_0_-1px_0_0_var(--glass-border),0_0_8px_color-mix(in_srgb,var(--accent-current)_10%,transparent)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleMyListClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 press-scale ${
                view === 'watchlist'
                  ? 'text-[var(--accent-current)] bg-[var(--accent-current)]/10 shadow-[0_0_8px_color-mix(in_srgb,var(--accent-current)_15%,transparent)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              My List
              {watchlistCount > 0 && (
                <span className="ml-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--accent-current)]/20 px-1 text-[10px] font-bold text-[var(--accent-current)]">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search movies, shows..."
              className="glass-input h-9 w-full rounded-full pl-9 pr-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-all duration-300 focus:shadow-[0_0_0_2px_var(--accent-current),0_0_12px_color-mix(in_srgb,var(--accent-current)_15%,transparent)]"
              aria-label="Search"
            />
            <AnimatePresence>
              {searchValue && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
            {showSuggestions && searchValue && (
              <SearchSuggestions query={searchValue} onSelect={handleSuggestionSelect} />
            )}
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchExpanded && (
            <motion.div
              className="absolute inset-x-0 top-0 flex h-16 items-center px-4 md:hidden"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  ref={searchInputRef}
                  type="text" value={searchValue} onChange={handleSearchChange}
                  placeholder="Search..."
                  className="glass-input h-9 w-full rounded-full pl-9 pr-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                  aria-label="Search"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile search toggle */}
          <button onClick={toggleMobileSearch} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors md:hidden" aria-label="Toggle search">
            <AnimatePresence mode="wait">
              {!searchExpanded ? (
                <motion.div key="s" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <Search className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile My List */}
          <button onClick={handleMyListClick} className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors md:hidden" aria-label="My List">
            <Bookmark className="h-4.5 w-4.5" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--accent-current)] px-1 text-[9px] font-bold text-white">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Download button */}
          <button
            onClick={() => setView('dashboard')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--accent-current)] hover:bg-[var(--accent-current)]/10 transition-colors"
            aria-label="Downloads"
          >
            <Download className="h-4.5 w-4.5" />
          </button>

          {/* Notification bell */}
          <NotificationBadge />

          {/* Keyboard shortcuts (desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={(e) => { e.stopPropagation(); setShowShortcuts(p => !p); }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {showShortcuts && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-black/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-xl p-3 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">Shortcuts</p>
                  {[
                    { key: '/', desc: 'Search' },
                    { key: 'Esc', desc: 'Go back' },
                    { key: '← →', desc: 'Navigate carousel' },
                    { key: 'M', desc: 'Toggle mute' },
                  ].map((s) => (
                    <div key={s.key} className="flex items-center justify-between py-1">
                      <span className="text-xs text-[var(--foreground)]">{s.desc}</span>
                      <kbd className="rounded border border-[var(--glass-border)] bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground)]">{s.key}</kbd>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button
            onClick={() => setView('settings-page')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu (avatar + dropdown with profiles + logout) */}
          {user && (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(p => !p)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getColorFromName(user.name)} ring-2 ring-transparent hover:ring-[var(--accent-current)]/50 transition-all duration-300`}
                aria-label="User menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-black/85 backdrop-blur-xl border border-[var(--glass-border)] rounded-xl overflow-hidden z-50"
                  >
                    {/* Current user info */}
                    <div className="p-4 border-b border-[var(--glass-border)]">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${getColorFromName(user.name)} shrink-0`}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[var(--foreground)] truncate">{user.name}</p>
                            {user.isAdmin && <Shield className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-[var(--muted-foreground)]">{user.isAdmin ? 'Administrator' : 'Member'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setShowUserMenu(false); setView('settings-page'); }}
                        className="mt-3 w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
                      >
                        <User className="h-3.5 w-3.5" /> View Profile
                      </button>
                    </div>

                    {/* Switch profiles */}
                    {profiles.length > 0 && (
                      <div className="p-2 border-b border-[var(--glass-border)]">
                        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                          <ArrowRightLeft className="h-3 w-3" /> Switch Profile
                        </p>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                          {profiles.map((profile) => (
                            <button
                              key={profile.id}
                              onClick={() => handleProfileSwitch(profile.id)}
                              disabled={profile.id === user.id}
                              className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                                profile.id === user.id
                                  ? 'bg-[var(--accent-current)]/10 text-[var(--accent-current)]'
                                  : 'text-[var(--foreground)] hover:bg-white/5'
                              }`}
                            >
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getColorFromName(profile.name)} shrink-0`}>
                                {profile.avatar ? (
                                  <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                  getInitials(profile.name)
                                )}
                              </div>
                              <span className="text-sm truncate">{profile.name}</span>
                              {profile.id === user.id && (
                                <span className="ml-auto text-[10px] text-[var(--accent-current)] font-medium">Current</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
