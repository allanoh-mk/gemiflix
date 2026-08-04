'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, EyeOff, Loader2, ArrowLeft, UserPlus, LogIn, Shield, Sparkles } from 'lucide-react';
import { useAuthStore, type UserProfile } from '@/lib/stores/auth-store';
import { useAppStore } from '@/lib/stores/app-store';
import { useThemeStore } from '@/lib/stores/theme-store';
import { toast } from 'sonner';

const PROFILE_COLORS = [
  'bg-purple-500', 'bg-cyan-500', 'bg-orange-500', 'bg-pink-500',
  'bg-green-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getProfileColor(index: number): string {
  return PROFILE_COLORS[index % PROFILE_COLORS.length];
}

type FormMode = 'profiles' | 'login' | 'signup' | 'profile-password';

export default function LoginScreen() {
  const [mode, setMode] = useState<FormMode>('profiles');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { login, signup, fetchProfiles, switchProfile, isLoading } = useAuthStore();
  const setView = useAppStore((s) => s.setView);
  const accentColor = useThemeStore((s) => s.accentColor);

  useEffect(() => {
    fetchProfiles().catch(() => {});
  }, [fetchProfiles]);

  const authProfiles = useAuthStore((s) => s.profiles);

  useEffect(() => {
    if (authProfiles.length > 0) {
      setProfiles(authProfiles);
    }
  }, [authProfiles]);

  // Password strength calculator
  useEffect(() => {
    if (!password) { setPasswordStrength(0); return; }
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength] || '';
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'][passwordStrength] || '';

  const handleLogin = useCallback(async () => {
    setError('');
    if (!name.trim() || !password.trim()) {
      setError('Please enter your name and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(name, password);
      const userName = useAuthStore.getState().user?.name || name;
      toast.success(`Welcome back, ${userName}!`);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, password, login, setView]);

  const handleSignup = useCallback(async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter a display name.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signup(name.trim(), password);
      toast.success('Account created successfully! Welcome to GemiFlix.');
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, password, confirmPassword, signup, setView]);

  const handleProfileSelect = useCallback((profile: UserProfile) => {
    setSelectedProfile(profile);
    setMode('profile-password');
    setError('');
    setPassword('');
  }, []);

  const handleProfilePassword = useCallback(async () => {
    setError('');
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (!selectedProfile) return;
    setIsSubmitting(true);
    try {
      await login(selectedProfile.name, password);
      toast.success(`Welcome back, ${selectedProfile.name}!`);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect password.');
    } finally {
      setIsSubmitting(false);
    }
  }, [password, selectedProfile, login, setView]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (mode === 'login') handleLogin();
        else if (mode === 'signup') handleSignup();
        else if (mode === 'profile-password') handleProfilePassword();
      }
    },
    [mode, handleLogin, handleSignup, handleProfilePassword]
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  };

  const backToProfiles = useCallback(() => {
    setMode('profiles');
    setError('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setSelectedProfile(null);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-orb" />
        <div className="aurora-orb" />
        <div className="aurora-orb" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="glass-panel relative z-10 w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-current)]/30 to-transparent animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="relative p-8">
          {/* Logo */}
          <div className="mb-2 flex items-center justify-center gap-2.5">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-current)]/20 shadow-[0_0_20px_color-mix(in_srgb,var(--accent-current)_30%,transparent)]"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Play className="h-5 w-5 text-[var(--accent-current)]" fill="currentColor" />
            </motion.div>
            <h1 className="text-gradient-animated text-3xl font-bold tracking-tight">GemiFlix</h1>
          </div>
          <div className="mb-8 flex justify-center">
            <span className="premium-badge">Liquid Glass Premium</span>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-md px-4 py-3 text-sm text-red-400"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Profiles Selection */}
            {mode === 'profiles' && (
              <motion.div key="profiles" {...fadeInUp} className="space-y-6">
                <p className="text-center text-sm text-[var(--muted-foreground)]">
                  Who&apos;s watching?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {profiles.map((profile, index) => (
                    <motion.button
                      key={profile.id}
                      className="group glass-card flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:bg-white/[0.08]"
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleProfileSelect(profile)}
                    >
                      <div className="relative">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-[var(--accent-current)]/50 transition-all"
                          />
                        ) : (
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-full ${getProfileColor(index)} text-xl font-bold text-white ring-2 ring-white/10 group-hover:ring-[var(--accent-current)]/50 transition-all`}
                          >
                            {getInitials(profile.name)}
                          </div>
                        )}
                        {profile.isAdmin && (
                          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
                            <Shield className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent-current)] transition-colors">
                        {profile.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setMode('login'); setError(''); }}
                    className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[var(--accent-current)] hover:bg-[var(--accent-current)]/10 transition-all duration-300"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <motion.div key="login" {...fadeInUp} className="space-y-5" onKeyDown={handleKeyDown}>
                <div className="flex items-center gap-3 mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={backToProfiles}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.button>
                  <p className="text-lg font-semibold text-[var(--foreground)]">Welcome back</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input peer w-full rounded-lg px-4 pt-5 pb-2 text-sm text-[var(--foreground)]"
                    autoFocus
                    autoComplete="username"
                  />
                  <label className="pointer-events-none absolute left-4 top-1 text-xs text-[var(--muted-foreground)] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                    Username
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input peer w-full rounded-lg px-4 pt-5 pb-2 pr-10 text-sm text-[var(--foreground)]"
                    autoComplete="current-password"
                  />
                  <label className="pointer-events-none absolute left-4 top-1 text-xs text-[var(--muted-foreground)] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                    Password
                  </label>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="glow-accent glass-button-liquid w-full rounded-lg bg-[var(--accent-current)] px-4 py-3 font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                  onClick={handleLogin}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2"><LogIn className="h-4 w-4" /> Sign In</span>
                  )}
                </motion.button>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-xs text-[var(--muted-foreground)]">New here?</span>
                  <button
                    onClick={() => { setMode('signup'); setError(''); setPassword(''); }}
                    className="text-xs font-semibold text-[var(--accent-current)] hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              </motion.div>
            )}

            {/* Signup Form */}
            {mode === 'signup' && (
              <motion.div key="signup" {...fadeInUp} className="space-y-4" onKeyDown={handleKeyDown}>
                <div className="flex items-center gap-3 mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={backToProfiles}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.button>
                  <p className="text-lg font-semibold text-[var(--foreground)]">Create Account</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input peer w-full rounded-lg px-4 pt-5 pb-2 text-sm text-[var(--foreground)]"
                    autoFocus
                    autoComplete="username"
                  />
                  <label className="pointer-events-none absolute left-4 top-1 text-xs text-[var(--muted-foreground)] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                    Display Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input peer w-full rounded-lg px-4 pt-5 pb-2 pr-10 text-sm text-[var(--foreground)]"
                    autoComplete="new-password"
                  />
                  <label className="pointer-events-none absolute left-4 top-1 text-xs text-[var(--muted-foreground)] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                    Password
                  </label>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? strengthColor : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${passwordStrength >= 4 ? 'text-green-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {strengthLabel}
                    </p>
                  </motion.div>
                )}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input peer w-full rounded-lg px-4 pt-5 pb-2 pr-10 text-sm text-[var(--foreground)]"
                    autoComplete="new-password"
                  />
                  <label className="pointer-events-none absolute left-4 top-1 text-xs text-[var(--muted-foreground)] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="glow-accent glass-button-liquid w-full rounded-lg bg-[var(--accent-current)] px-4 py-3 font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                  onClick={handleSignup}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2"><UserPlus className="h-4 w-4" /> Create Account</span>
                  )}
                </motion.button>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-xs text-[var(--muted-foreground)]">Already have an account?</span>
                  <button
                    onClick={() => { setMode('login'); setError(''); setConfirmPassword(''); setName(''); }}
                    className="text-xs font-semibold text-[var(--accent-current)] hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </motion.div>
            )}

            {/* Profile Password Entry */}
            {mode === 'profile-password' && selectedProfile && (
              <motion.div key="profile-password" {...fadeInUp} className="space-y-5" onKeyDown={handleKeyDown}>
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={backToProfiles}
                    className="self-start flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.button>
                  <div className="relative">
                    {selectedProfile.avatar ? (
                      <img src={selectedProfile.avatar} alt={selectedProfile.name} className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--accent-current)]/50" />
                    ) : (
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${getProfileColor(profiles.findIndex(p => p.id === selectedProfile.id))} text-2xl font-bold text-white ring-2 ring-[var(--accent-current)]/50`}>
                        {getInitials(selectedProfile.name)}
                      </div>
                    )}
                    {selectedProfile.isAdmin && (
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 ring-2 ring-black/50">
                        <Shield className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-center text-lg font-semibold text-[var(--foreground)]">{selectedProfile.name}</p>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input peer w-full rounded-lg px-4 pt-5 pb-2 pr-10 text-sm text-[var(--foreground)]"
                    autoFocus
                    autoComplete="current-password"
                  />
                  <label className="pointer-events-none absolute left-4 top-1 text-xs text-[var(--muted-foreground)] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs">
                    Password
                  </label>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="glow-accent glass-button-liquid w-full rounded-lg bg-[var(--accent-current)] px-4 py-3 font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                  onClick={handleProfilePassword}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    'Unlock'
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom tagline */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <Sparkles className="h-3 w-3" />
            <span>Unlimited movies, shows, and more</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
