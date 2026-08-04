'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Save, Users, Plus, X, Shield, Baby } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useThemeStore, type AccentColor, type Density, accentColors } from '@/lib/stores/theme-store';
import { useAuthStore, type UserProfile } from '@/lib/stores/auth-store';
import { useAppStore } from '@/lib/stores/app-store';
import { showSettingsSaved } from '@/lib/toast';

const colorSwatches: { color: AccentColor; hex: string; name: string }[] = [
  { color: 'purple', hex: '#a855f7', name: 'Purple' },
  { color: 'cyan', hex: '#06b6d4', name: 'Cyan' },
  { color: 'orange', hex: '#f97316', name: 'Orange' },
];

const densityOptions: { value: Density; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/* Deterministic color from name */
function nameToColor(name: string): string {
  const palette = ['#a855f7', '#06b6d4', '#f97316', '#22c55e', '#ec4899', '#eab308'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function SettingsPanel() {
  const showSettings = useAppStore((s) => s.showSettings);
  const toggleSettings = useAppStore((s) => s.toggleSettings);
  const user = useAuthStore((s) => s.user);
  const fetchProfiles = useAuthStore((s) => s.fetchProfiles);
  const signup = useAuthStore((s) => s.signup);

  const accent = useThemeStore((s) => s.accent);
  const blur = useThemeStore((s) => s.blur);
  const noise = useThemeStore((s) => s.noise);
  const density = useThemeStore((s) => s.density);
  const setAccent = useThemeStore((s) => s.setAccent);
  const setBlur = useThemeStore((s) => s.setBlur);
  const setNoise = useThemeStore((s) => s.setNoise);
  const setDensity = useThemeStore((s) => s.setDensity);

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* Profile management state */
  const [localProfiles, setLocalProfiles] = useState<UserProfile[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsKid, setNewIsKid] = useState(false);
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  /* Load profiles when settings open */
  useEffect(() => {
    if (showSettings) {
      fetchProfiles().then(() => {
        const profiles = useAuthStore.getState().profiles;
        setLocalProfiles([...profiles]);
      });
    }
  }, [showSettings, fetchProfiles]);

  const handleCreateProfile = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setCreateError('All fields are required');
      return;
    }
    setIsCreating(true);
    setCreateError('');
    try {
      await signup(newName.trim(), newEmail.trim(), newPassword.trim());
      await fetchProfiles();
      const profiles = useAuthStore.getState().profiles;
      setLocalProfiles([...profiles]);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewIsKid(false);
      setShowCreateForm(false);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    setLocalProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accent,
          blur,
          noise,
          density,
        }),
      });
      setSaved(true);
      showSettingsSaved();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* silently fail */
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={showSettings} onOpenChange={toggleSettings}>
      <SheetContent
        side="right"
        className="w-full border-white/5 bg-black/80 p-0 backdrop-blur-2xl sm:max-w-md"
      >
        {/* Header */}
        <SheetHeader className="border-b border-white/5 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-current)]/20">
              <Palette className="h-4.5 w-4.5 text-[var(--accent-current)]" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold text-white">
                Settings
              </SheetTitle>
              <SheetDescription className="text-xs text-white/40">
                Customize your viewing experience
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable settings content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
          <div className="flex flex-col gap-5">
            {/* Section 0: Profiles */}
            <motion.section
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--accent-current)]" />
                  <h3 className="text-sm font-semibold text-white/90">
                    Profiles
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setCreateError('');
                  }}
                  className="glass-button-shine flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--accent-current)]"
                >
                  <Plus className="h-3 w-3" />
                  Create
                </button>
              </div>

              {/* Profile list */}
              <div className="flex flex-col gap-2">
                {localProfiles.map((profile) => {
                  const isCurrentUser = user?.id === profile.id;
                  const color = nameToColor(profile.name);
                  return (
                    <div
                      key={profile.id}
                      className="glass-card flex items-center gap-3 rounded-xl px-3 py-2.5"
                    >
                      {/* Avatar */}
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {getInitials(profile.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white/90">
                          {profile.name}
                        </p>
                        <p className="truncate text-[11px] text-white/40">
                          {profile.email}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5">
                        {profile.isAdmin && (
                          <span className="flex items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                            <Shield className="h-2.5 w-2.5" />
                            Admin
                          </span>
                        )}
                        {profile.isKid && (
                          <span className="flex items-center gap-0.5 rounded-md bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
                            <Baby className="h-2.5 w-2.5" />
                            Kid
                          </span>
                        )}

                        {/* Delete button (not for current user) */}
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-white/20 transition-colors hover:bg-white/10 hover:text-white/60"
                            aria-label={`Remove ${profile.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {localProfiles.length === 0 && (
                  <p className="py-3 text-center text-xs text-white/30">
                    No profiles yet. Create one to get started.
                  </p>
                )}
              </div>

              {/* Create profile form */}
              <AnimatePresence>
                {showCreateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[var(--accent-current)]/50"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[var(--accent-current)]/50"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[var(--accent-current)]/50"
                      />

                      {/* Kid toggle */}
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <div
                          className={`relative h-5 w-9 rounded-full transition-colors ${newIsKid ? 'bg-[var(--accent-current)]' : 'bg-white/10'}`}
                          onClick={() => setNewIsKid(!newIsKid)}
                        >
                          <motion.div
                            className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                            animate={{ left: newIsKid ? 18 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                        <span className="text-xs text-white/60">Kids profile</span>
                      </label>

                      {createError && (
                        <p className="text-[11px] text-red-400">{createError}</p>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowCreateForm(false)}
                          className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateProfile}
                          disabled={isCreating}
                          className="glass-button-shine flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-current)] px-3 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                        >
                          {isCreating ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : null}
                          Create Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Section 1: Accent Color */}
            <motion.section
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-white/90">
                Accent Color
              </h3>
              <div className="flex items-center gap-4">
                {colorSwatches.map((swatch) => (
                  <button
                    key={swatch.color}
                    onClick={() => setAccent(swatch.color)}
                    className="group flex flex-col items-center gap-1.5"
                    aria-label={`Set accent color to ${swatch.name}`}
                  >
                    <div
                      className={`relative h-10 w-10 rounded-full transition-all duration-200 ${
                        accent === swatch.color
                          ? 'ring-2 ring-offset-2 ring-offset-black'
                          : 'hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: swatch.hex,
                        ringColor: accent === swatch.color ? swatch.hex : undefined,
                      }}
                    >
                      {accent === swatch.color && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-white drop-shadow-md" />
                        </motion.div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium transition-colors ${
                        accent === swatch.color
                          ? 'text-[var(--accent-current)]'
                          : 'text-white/40 group-hover:text-white/60'
                      }`}
                    >
                      {swatch.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Section 2: Blur Intensity */}
            <motion.section
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">
                  Blur Intensity
                </h3>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-mono text-white/60">
                  {blur}px
                </span>
              </div>
              <Slider
                value={[blur]}
                min={0}
                max={40}
                step={1}
                onValueChange={(val) => setBlur(val[0])}
                className="w-full"
              />
              <div className="mt-1.5 flex justify-between text-[10px] text-white/30">
                <span>0px</span>
                <span>40px</span>
              </div>
            </motion.section>

            {/* Section 3: Noise Texture */}
            <motion.section
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">
                  Noise Texture
                </h3>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-mono text-white/60">
                  {noise}
                </span>
              </div>
              <Slider
                value={[noise]}
                min={0}
                max={10}
                step={1}
                onValueChange={(val) => setNoise(val[0])}
                className="w-full"
              />
              <div className="mt-1.5 flex justify-between text-[10px] text-white/30">
                <span>0</span>
                <span>10</span>
              </div>
            </motion.section>

            {/* Section 4: Layout Density */}
            <motion.section
              custom={4}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-white/90">
                Layout Density
              </h3>
              <div className="flex gap-2">
                {densityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDensity(option.value)}
                    className={`relative flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                      density === option.value
                        ? 'bg-[var(--accent-current)]/20 text-[var(--accent-current)]'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    {density === option.value && (
                      <motion.div
                        layoutId="density-indicator"
                        className="absolute inset-0 rounded-lg border border-[var(--accent-current)]/40"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Save button footer */}
        <div className="border-t border-white/5 px-6 py-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="glow-accent flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-current)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
          {user && (
            <p className="mt-2 text-center text-[10px] text-white/25">
              Synced to {user.name}&apos;s profile
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
