'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Palette, Play, Bell, Shield, Download, Accessibility,
  Globe, BarChart3, Info, Users, Database, Monitor, Eye, Lock,
  Megaphone, HardDrive, Key, Server, Archive, Save, Check, X, Plus,
  Trash2, Edit3, Star, Search, Filter, MoreVertical, Upload,
  RefreshCw, AlertTriangle, ExternalLink, Bug, ChevronDown,
  Volume2, Subtitles, Clock, Wifi, WifiOff, FileText, Brush,
  Sparkles, Moon, Sun, MonitorSpeaker, Gauge, Zap, Cpu, MemoryStick,
  Timer, Activity, ShieldCheck, ShieldAlert, BadgeCheck, Fingerprint,
  Globe2, Languages, Calendar, Thermometer, Video, Tv, Film,
  FolderOpen, Settings, ClipboardList, Trash, DownloadCloud,
  CheckCircle2, XCircle, AlertCircle, CheckCheck, Loader2, EyeOff
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/stores/app-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useThemeStore, accentColors } from '@/lib/stores/theme-store';
import { toast } from 'sonner';

/* ================================================================
   TYPES
   ================================================================ */
interface UserSettingsData {
  // Profile
  displayName: string;
  bio: string;
  avatar: string;
  // Appearance
  accentColor: string;
  themeMode: string;
  blurIntensity: number;
  noiseLevel: number;
  layoutDensity: string;
  reduceMotion: boolean;
  showAurora: boolean;
  showSparkles: boolean;
  cardStyle: string;
  borderRadius: number;
  fontSize: string;
  animationSpeed: string;
  // Playback
  defaultVideoQuality: string;
  autoPlayNext: boolean;
  autoPlayTrailers: boolean;
  skipIntro: boolean;
  skipRecap: boolean;
  defaultVolume: number;
  enableSubtitles: boolean;
  subtitleLanguage: string;
  subtitleFontSize: string;
  subtitleColor: string;
  audioLanguage: string;
  playbackSpeed: string;
  hardwareAcceleration: boolean;
  streamingBuffer: string;
  maximumBitrate: string;
  // Notifications
  pushNotifications: boolean;
  newReleaseAlerts: boolean;
  watchlistAlerts: boolean;
  recommendationAlerts: boolean;
  systemAlerts: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationSound: string;
  notificationBadge: boolean;
  // Privacy
  profileVisibility: string;
  showWatchHistory: boolean;
  showWatchlist: boolean;
  showOnlineStatus: boolean;
  dataCollection: boolean;
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  // Downloads
  downloadQuality: string;
  downloadPath: string;
  autoDeleteWatched: boolean;
  wifiOnlyDownloads: boolean;
  maxConcurrentDownloads: number;
  maxDownloadStorage: number;
  downloadNotification: boolean;
  autoDownloadEpisodes: boolean;
  // Accessibility
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  closedCaptions: boolean;
  audioDescriptions: boolean;
  colorBlindness: string;
  focusIndicators: boolean;
  keyboardNavigation: boolean;
  // Language
  interfaceLanguage: string;
  contentRegion: string;
  dateFormat: string;
  timeFormat: string;
  temperatureUnit: string;
  // Password
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AdminSettingsData {
  // Platform
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  supportUrl: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYouTube: string;
  socialDiscord: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  // Appearance
  globalAccentColor: string;
  defaultTheme: string;
  allowCustomThemes: boolean;
  defaultBlur: number;
  defaultNoise: number;
  defaultDensity: string;
  customCss: string;
  customJs: string;
  brandColorPrimary: string;
  brandColorSecondary: string;
  brandGradientStart: string;
  brandGradientEnd: string;
  loadingText: string;
  loadingAnimation: string;
  // Notifications
  globalPushEnabled: boolean;
  globalEmailEnabled: boolean;
  maxNotifsPerUser: number;
  notifRetentionDays: number;
  autoClearRead: boolean;
  systemTemplate: string;
  welcomeTemplate: string;
  updateTemplate: string;
  maintenanceTemplate: string;
  customBroadcast: string;
  // Security
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  passwordRequireUpper: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecial: boolean;
  sessionTimeout: number;
  maxSessionsPerUser: number;
  ipWhitelist: string;
  ipBlacklist: string;
  rateLimiting: boolean;
  rateLimitRpm: number;
  enableAuditLog: boolean;
  twoFactorRequired: boolean;
  admin2faRequired: boolean;
  // Analytics
  analyticsEnabled: boolean;
  trackPageViews: boolean;
  trackSearchQueries: boolean;
  trackWatchEvents: boolean;
  trackDownloads: boolean;
  dataRetentionDays: number;
  anonymizeIp: boolean;
  shareAnalyticsWithUsers: boolean;
  // Storage
  maxStoragePerUser: number;
  totalStorageLimit: number;
  autoCleanupOldHistory: boolean;
  cleanupAfterDays: number;
  maxPosterCacheSize: number;
  maxDownloadStorage: number;
  // API
  apiMovieBoxUrl: string;
  apiTimeout: number;
  apiRetryCount: number;
  enableCaching: boolean;
  cacheTtl: number;
  proxyUrl: string;
  enableRateLimit: boolean;
  apiRateLimit: number;
  apiKey: string;
  // Backup
  autoBackup: boolean;
  backupFrequency: string;
  backupRetentionCount: number;
  backupStoragePath: string;
  backupCompression: boolean;
  backupEncryption: boolean;
}

interface AdminUserData {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  bio: string;
  isAdmin: boolean;
  isKid: boolean;
  accentColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ================================================================
   DEFAULTS
   ================================================================ */
const defaultUserSettings: UserSettingsData = {
  displayName: '', bio: '', avatar: '',
  accentColor: 'purple', themeMode: 'oled', blurIntensity: 24, noiseLevel: 3,
  layoutDensity: 'comfortable', reduceMotion: false, showAurora: true,
  showSparkles: true, cardStyle: 'glass', borderRadius: 12, fontSize: 'medium',
  animationSpeed: 'normal',
  defaultVideoQuality: '1080p', autoPlayNext: true, autoPlayTrailers: false,
  skipIntro: true, skipRecap: true, defaultVolume: 0.8, enableSubtitles: false,
  subtitleLanguage: 'en', subtitleFontSize: 'medium', subtitleColor: 'white',
  audioLanguage: 'en', playbackSpeed: '1x', hardwareAcceleration: true,
  streamingBuffer: '30', maximumBitrate: 'auto',
  pushNotifications: true, newReleaseAlerts: true, watchlistAlerts: false,
  recommendationAlerts: true, systemAlerts: true, quietHoursEnabled: false,
  quietHoursStart: '22:00', quietHoursEnd: '07:00', notificationSound: 'default',
  notificationBadge: true,
  profileVisibility: 'private', showWatchHistory: true, showWatchlist: true,
  showOnlineStatus: true, dataCollection: false, twoFactorAuth: false,
  loginNotifications: true,
  downloadQuality: '1080p', downloadPath: '', autoDeleteWatched: false,
  wifiOnlyDownloads: true, maxConcurrentDownloads: 2, maxDownloadStorage: 10,
  downloadNotification: true, autoDownloadEpisodes: false,
  highContrast: false, largeText: false, screenReader: false,
  closedCaptions: false, audioDescriptions: false, colorBlindness: 'none',
  focusIndicators: true, keyboardNavigation: true,
  interfaceLanguage: 'en', contentRegion: 'us', dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h', temperatureUnit: 'fahrenheit',
  currentPassword: '', newPassword: '', confirmPassword: '',
};

const defaultAdminSettings: AdminSettingsData = {
  siteName: 'GemiFlix', siteDescription: 'Your premium media center',
  logoUrl: '', faviconUrl: '', contactEmail: '', supportUrl: '',
  socialFacebook: '', socialTwitter: '', socialInstagram: '',
  socialYouTube: '', socialDiscord: '', maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance.',
  globalAccentColor: 'purple', defaultTheme: 'oled', allowCustomThemes: true,
  defaultBlur: 24, defaultNoise: 3, defaultDensity: 'comfortable',
  customCss: '', customJs: '', brandColorPrimary: '#a855f7',
  brandColorSecondary: '#06b6d4', brandGradientStart: '#a855f7',
  brandGradientEnd: '#06b6d4', loadingText: 'Loading GemiFlix...',
  loadingAnimation: 'pulse',
  globalPushEnabled: true, globalEmailEnabled: true, maxNotifsPerUser: 100,
  notifRetentionDays: 30, autoClearRead: false, systemTemplate: '',
  welcomeTemplate: '', updateTemplate: '', maintenanceTemplate: '',
  customBroadcast: '',
  maxLoginAttempts: 5, lockoutDuration: 30, passwordMinLength: 8,
  passwordRequireUpper: true, passwordRequireNumbers: true,
  passwordRequireSpecial: false, sessionTimeout: 60, maxSessionsPerUser: 3,
  ipWhitelist: '', ipBlacklist: '', rateLimiting: true, rateLimitRpm: 60,
  enableAuditLog: true, twoFactorRequired: false, admin2faRequired: true,
  analyticsEnabled: true, trackPageViews: true, trackSearchQueries: true,
  trackWatchEvents: true, trackDownloads: true, dataRetentionDays: 90,
  anonymizeIp: true, shareAnalyticsWithUsers: false,
  maxStoragePerUser: 50, totalStorageLimit: 500, autoCleanupOldHistory: true,
  cleanupAfterDays: 365, maxPosterCacheSize: 5, maxDownloadStorage: 100,
  apiMovieBoxUrl: '', apiTimeout: 30, apiRetryCount: 3, enableCaching: true,
  cacheTtl: 3600, proxyUrl: '', enableRateLimit: true, apiRateLimit: 100,
  apiKey: '',
  autoBackup: true, backupFrequency: 'weekly', backupRetentionCount: 7,
  backupStoragePath: './backups', backupCompression: true, backupEncryption: false,
};

/* ================================================================
   COLOR SWATCHES
   ================================================================ */
const colorSwatches = [
  { color: 'purple', hex: '#a855f7', name: 'Purple' },
  { color: 'cyan', hex: '#06b6d4', name: 'Cyan' },
  { color: 'orange', hex: '#f97316', name: 'Orange' },
  { color: 'pink', hex: '#ec4899', name: 'Pink' },
  { color: 'green', hex: '#22c55e', name: 'Green' },
  { color: 'red', hex: '#ef4444', name: 'Red' },
  { color: 'yellow', hex: '#eab308', name: 'Yellow' },
  { color: 'blue', hex: '#3b82f6', name: 'Blue' },
  { color: 'emerald', hex: '#10b981', name: 'Emerald' },
  { color: 'rose', hex: '#f43f5e', name: 'Rose' },
  { color: 'violet', hex: '#8b5cf6', name: 'Violet' },
  { color: 'amber', hex: '#f59e0b', name: 'Amber' },
  { color: 'teal', hex: '#14b8a6', name: 'Teal' },
  { color: 'indigo', hex: '#6366f1', name: 'Indigo' },
  { color: 'lime', hex: '#84cc16', name: 'Lime' },
  { color: 'sky', hex: '#0ea5e9', name: 'Sky' },
];

/* ================================================================
   TAB DEFINITIONS
   ================================================================ */
type SettingsTab = 'profile' | 'appearance' | 'playback' | 'notifications' | 'privacy' | 'downloads' | 'accessibility' | 'language' | 'stats' | 'about' |
  'admin-users' | 'admin-content' | 'admin-platform' | 'admin-appearance' | 'admin-notifications' | 'admin-security' | 'admin-analytics' | 'admin-storage' | 'admin-api' | 'admin-system' | 'admin-backup';

interface TabDef {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  admin?: boolean;
}

const userTabs: TabDef[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
  { id: 'playback', label: 'Playback', icon: <Play className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
  { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4" /> },
  { id: 'accessibility', label: 'Accessibility', icon: <Accessibility className="w-4 h-4" /> },
  { id: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
  { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
];

const adminTabs: TabDef[] = [
  { id: 'admin-users', label: 'Users', icon: <Users className="w-4 h-4" />, admin: true },
  { id: 'admin-content', label: 'Content', icon: <Film className="w-4 h-4" />, admin: true },
  { id: 'admin-platform', label: 'Platform', icon: <Monitor className="w-4 h-4" />, admin: true },
  { id: 'admin-appearance', label: 'Appearance', icon: <Brush className="w-4 h-4" />, admin: true },
  { id: 'admin-notifications', label: 'Notifications', icon: <Megaphone className="w-4 h-4" />, admin: true },
  { id: 'admin-security', label: 'Security', icon: <Lock className="w-4 h-4" />, admin: true },
  { id: 'admin-analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" />, admin: true },
  { id: 'admin-storage', label: 'Storage', icon: <HardDrive className="w-4 h-4" />, admin: true },
  { id: 'admin-api', label: 'API', icon: <Key className="w-4 h-4" />, admin: true },
  { id: 'admin-system', label: 'System', icon: <Server className="w-4 h-4" />, admin: true },
  { id: 'admin-backup', label: 'Backup', icon: <Archive className="w-4 h-4" />, admin: true },
];

/* ================================================================
   SHARED SETTING ROW COMPONENT
   ================================================================ */
function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium text-[var(--foreground)]">{label}</Label>
        {description && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
      {icon && <span className="text-[var(--accent-current)]">{icon}</span>}
      <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">{title}</h3>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function SettingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-panel p-4 md:p-5">
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

/* Glassmorphic select */
function GlassSelect({ value, onValueChange, options, className = '' }: {
  value: string; onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`bg-black/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--accent-current)]/50 ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

/* Glassmorphic input */
function GlassInput({ value, onChange, type = 'text', placeholder = '', className = '' }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string;
}) {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`glass-input bg-black/80 backdrop-blur-xl border-[var(--glass-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${className}`}
    />
  );
}

/* Glassmorphic textarea */
function GlassTextarea({ value, onChange, placeholder = '', rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="glass-input bg-black/80 backdrop-blur-xl border-[var(--glass-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none"
    />
  );
}

/* Save animation button */
function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={saving}
      className="glow-accent bg-[var(--accent-current)] hover:brightness-110 text-white font-semibold transition-all"
    >
      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
    </Button>
  );
}

/* ================================================================
   PROFILE TAB
   ================================================================ */
function ProfileTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordError, setPasswordError] = useState('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    if (!settings.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (settings.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (settings.newPassword !== settings.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    toast.success('Password changed successfully');
    setSettings((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Profile Information" icon={<User className="w-4 h-4" />} />

        {/* Display Name */}
        <SettingRow label="Display Name" description="Your public display name">
          <GlassInput
            value={settings.displayName || user?.name || ''}
            onChange={(v) => setSettings((p) => ({ ...p, displayName: v }))}
            placeholder="Enter your name"
            className="w-full sm:w-64"
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Bio */}
        <SettingRow label="Bio / About" description="A short description about yourself">
          <GlassTextarea
            value={settings.bio}
            onChange={(v) => setSettings((p) => ({ ...p, bio: v }))}
            placeholder="Tell us about yourself..."
            rows={2}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Profile Image */}
        <SettingRow label="Profile Image" description="Upload a profile picture (stored locally)">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-[var(--glass-border)]">
                <AvatarImage src={settings.avatar || user?.avatar} />
                <AvatarFallback className="bg-[var(--accent-current)]/20 text-[var(--accent-current)] font-bold">
                  {(settings.displayName || user?.name || 'U').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[var(--accent-current)] flex items-center justify-center text-white shadow-lg"
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            {settings.avatar && (
              <button
                onClick={() => setSettings((p) => ({ ...p, avatar: '' }))}
                className="text-xs text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Account Info" icon={<Shield className="w-4 h-4" />} />

        {/* Account Created */}
        <SettingRow label="Account Created">
          <span className="text-sm text-[var(--muted-foreground)]">
            {user ? new Date().toLocaleDateString() : 'N/A'}
          </span>
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Last Updated */}
        <SettingRow label="Last Updated">
          <span className="text-sm text-[var(--muted-foreground)]">{new Date().toLocaleDateString()}</span>
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Change Password" icon={<Key className="w-4 h-4" />} />

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-[var(--muted-foreground)]">Current Password</Label>
            <GlassInput
              type="password"
              value={settings.currentPassword}
              onChange={(v) => setSettings((p) => ({ ...p, currentPassword: v }))}
              placeholder="Enter current password"
              className="w-full sm:w-64"
            />
          </div>
          <div>
            <Label className="text-xs text-[var(--muted-foreground)]">New Password</Label>
            <GlassInput
              type="password"
              value={settings.newPassword}
              onChange={(v) => setSettings((p) => ({ ...p, newPassword: v }))}
              placeholder="Enter new password"
              className="w-full sm:w-64"
            />
          </div>
          <div>
            <Label className="text-xs text-[var(--muted-foreground)]">Confirm Password</Label>
            <GlassInput
              type="password"
              value={settings.confirmPassword}
              onChange={(v) => setSettings((p) => ({ ...p, confirmPassword: v }))}
              placeholder="Confirm new password"
              className="w-full sm:w-64"
            />
          </div>
          {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
          <Button onClick={handleChangePassword} size="sm" variant="outline" className="border-[var(--glass-border)] text-[var(--foreground)]">
            Change Password
          </Button>
        </div>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   APPEARANCE TAB
   ================================================================ */
function AppearanceTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  const themeBlur = useThemeStore((s) => s.blur);
  const themeNoise = useThemeStore((s) => s.noise);
  const setThemeBlur = useThemeStore((s) => s.setBlur);
  const setThemeNoise = useThemeStore((s) => s.setNoise);

  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Theme & Colors" icon={<Palette className="w-4 h-4" />} />

        {/* Accent Color */}
        <div className="py-3">
          <Label className="text-sm font-medium text-[var(--foreground)]">Accent Color</Label>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">Choose your interface accent color</p>
          <div className="flex flex-wrap gap-2">
            {colorSwatches.map((swatch) => (
              <button
                key={swatch.color}
                onClick={() => setSettings((p) => ({ ...p, accentColor: swatch.color }))}
                className="group flex flex-col items-center gap-1"
              >
                <div
                  className={`relative h-8 w-8 rounded-full transition-all duration-200 ${settings.accentColor === swatch.color ? 'ring-2 ring-offset-2 ring-offset-[#050505]' : 'hover:scale-110'}`}
                  style={{ backgroundColor: swatch.hex, ringColor: settings.accentColor === swatch.color ? swatch.hex : undefined }}
                >
                  {settings.accentColor === swatch.color && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                  )}
                </div>
                <span className="text-[10px] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                  {swatch.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <Separator className="bg-white/5" />

        {/* Theme Mode */}
        <SettingRow label="Theme Mode" description="Choose your preferred theme">
          <GlassSelect
            value={settings.themeMode}
            onValueChange={(v) => setSettings((p) => ({ ...p, themeMode: v }))}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'oled', label: 'OLED Black' },
              { value: 'dim', label: 'Dim' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Card Style */}
        <SettingRow label="Card Style" description="How content cards are displayed">
          <GlassSelect
            value={settings.cardStyle}
            onValueChange={(v) => setSettings((p) => ({ ...p, cardStyle: v }))}
            options={[
              { value: 'glass', label: 'Glass' },
              { value: 'solid', label: 'Solid' },
              { value: 'minimal', label: 'Minimal' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Visual Effects" icon={<Sparkles className="w-4 h-4" />} />

        {/* Blur Intensity */}
        <SettingRow label="Blur Intensity" description={`Current: ${themeBlur}px`}>
          <div className="w-full sm:w-64">
            <Slider
              value={[settings.blurIntensity]}
              min={0} max={40} step={1}
              onValueChange={(v) => { setSettings((p) => ({ ...p, blurIntensity: v[0] })); setThemeBlur(v[0]); }}
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
              <span>0</span><span>40</span>
            </div>
          </div>
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Noise Texture */}
        <SettingRow label="Noise Texture Level" description={`Current: ${themeNoise}`}>
          <div className="w-full sm:w-64">
            <Slider
              value={[settings.noiseLevel]}
              min={0} max={10} step={1}
              onValueChange={(v) => { setSettings((p) => ({ ...p, noiseLevel: v[0] })); setThemeNoise(v[0]); }}
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
              <span>0</span><span>10</span>
            </div>
          </div>
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Show Aurora */}
        <SettingRow label="Show Aurora Background" description="Animated gradient background effect">
          <Switch
            checked={settings.showAurora}
            onCheckedChange={(v) => setSettings((p) => ({ ...p, showAurora: v }))}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Show Sparkles */}
        <SettingRow label="Show Sparkle Particles" description="Floating particle effects">
          <Switch
            checked={settings.showSparkles}
            onCheckedChange={(v) => setSettings((p) => ({ ...p, showSparkles: v }))}
          />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Layout" icon={<LayoutGrid className="w-4 h-4" />} />

        {/* Layout Density */}
        <SettingRow label="Layout Density" description="Content spacing and padding">
          <GlassSelect
            value={settings.layoutDensity}
            onValueChange={(v) => setSettings((p) => ({ ...p, layoutDensity: v }))}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'spacious', label: 'Spacious' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Border Radius */}
        <SettingRow label="Border Radius" description={`Current: ${settings.borderRadius}px`}>
          <div className="w-full sm:w-64">
            <Slider
              value={[settings.borderRadius]}
              min={0} max={24} step={1}
              onValueChange={(v) => setSettings((p) => ({ ...p, borderRadius: v[0] }))}
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
              <span>0</span><span>24</span>
            </div>
          </div>
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Font Size */}
        <SettingRow label="Font Size" description="Base font size for the interface">
          <GlassSelect
            value={settings.fontSize}
            onValueChange={(v) => setSettings((p) => ({ ...p, fontSize: v }))}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
              { value: 'xlarge', label: 'Extra Large' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Reduce Motion */}
        <SettingRow label="Reduce Motion" description="Minimize animations and transitions">
          <Switch
            checked={settings.reduceMotion}
            onCheckedChange={(v) => setSettings((p) => ({ ...p, reduceMotion: v }))}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        {/* Animation Speed */}
        <SettingRow label="Animation Speed" description="Speed of UI transitions">
          <GlassSelect
            value={settings.animationSpeed}
            onValueChange={(v) => setSettings((p) => ({ ...p, animationSpeed: v }))}
            options={[
              { value: 'slow', label: 'Slow' },
              { value: 'normal', label: 'Normal' },
              { value: 'fast', label: 'Fast' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   PLAYBACK TAB
   ================================================================ */
function PlaybackTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Video Quality" icon={<Video className="w-4 h-4" />} />

        <SettingRow label="Default Video Quality" description="Preferred video resolution">
          <GlassSelect
            value={settings.defaultVideoQuality}
            onValueChange={(v) => setSettings((p) => ({ ...p, defaultVideoQuality: v }))}
            options={[
              { value: '4k', label: '4K' },
              { value: '1080p', label: '1080p' },
              { value: '720p', label: '720p' },
              { value: '480p', label: '480p' },
              { value: '360p', label: '360p' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Maximum Bitrate" description="Maximum streaming quality">
          <GlassSelect
            value={settings.maximumBitrate}
            onValueChange={(v) => setSettings((p) => ({ ...p, maximumBitrate: v }))}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: '5', label: '5 Mbps' },
              { value: '10', label: '10 Mbps' },
              { value: '25', label: '25 Mbps' },
              { value: '50', label: '50 Mbps' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Hardware Acceleration" description="Use GPU for video decoding">
          <Switch checked={settings.hardwareAcceleration} onCheckedChange={(v) => setSettings((p) => ({ ...p, hardwareAcceleration: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Streaming Buffer Size" description="Pre-buffer duration">
          <GlassSelect
            value={settings.streamingBuffer}
            onValueChange={(v) => setSettings((p) => ({ ...p, streamingBuffer: v }))}
            options={[
              { value: '10', label: '10s' },
              { value: '20', label: '20s' },
              { value: '30', label: '30s' },
              { value: '60', label: '60s' },
              { value: '120', label: '120s' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Autoplay & Skipping" icon={<Zap className="w-4 h-4" />} />

        <SettingRow label="Auto-Play Next Episode" description="Automatically play the next episode">
          <Switch checked={settings.autoPlayNext} onCheckedChange={(v) => setSettings((p) => ({ ...p, autoPlayNext: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Auto-Play Trailers" description="Play trailers on title pages">
          <Switch checked={settings.autoPlayTrailers} onCheckedChange={(v) => setSettings((p) => ({ ...p, autoPlayTrailers: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Skip Intro Automatically" description="Skip TV show intros">
          <Switch checked={settings.skipIntro} onCheckedChange={(v) => setSettings((p) => ({ ...p, skipIntro: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Skip Recap Automatically" description="Skip episode recaps">
          <Switch checked={settings.skipRecap} onCheckedChange={(v) => setSettings((p) => ({ ...p, skipRecap: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Audio" icon={<Volume2 className="w-4 h-4" />} />

        <SettingRow label="Default Volume" description={`Volume: ${Math.round(settings.defaultVolume * 100)}%`}>
          <div className="w-full sm:w-64">
            <Slider
              value={[settings.defaultVolume * 100]}
              min={0} max={100} step={1}
              onValueChange={(v) => setSettings((p) => ({ ...p, defaultVolume: v[0] / 100 }))}
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
              <span>0%</span><span>100%</span>
            </div>
          </div>
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Preferred Audio Language" description="Default audio track language">
          <GlassSelect
            value={settings.audioLanguage}
            onValueChange={(v) => setSettings((p) => ({ ...p, audioLanguage: v }))}
            options={[
              { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' }, { value: 'de', label: 'German' },
              { value: 'ja', label: 'Japanese' }, { value: 'ko', label: 'Korean' },
              { value: 'zh', label: 'Chinese' }, { value: 'ar', label: 'Arabic' },
              { value: 'hi', label: 'Hindi' }, { value: 'pt', label: 'Portuguese' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Default Playback Speed" description="Playback speed for all content">
          <GlassSelect
            value={settings.playbackSpeed}
            onValueChange={(v) => setSettings((p) => ({ ...p, playbackSpeed: v }))}
            options={[
              { value: '0.25', label: '0.25x' }, { value: '0.5', label: '0.5x' },
              { value: '0.75', label: '0.75x' }, { value: '1', label: '1x' },
              { value: '1.25', label: '1.25x' }, { value: '1.5', label: '1.5x' },
              { value: '2', label: '2x' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Subtitles" icon={<Subtitles className="w-4 h-4" />} />

        <SettingRow label="Enable Subtitles by Default" description="Show subtitles for all content">
          <Switch checked={settings.enableSubtitles} onCheckedChange={(v) => setSettings((p) => ({ ...p, enableSubtitles: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Preferred Subtitle Language">
          <GlassSelect
            value={settings.subtitleLanguage}
            onValueChange={(v) => setSettings((p) => ({ ...p, subtitleLanguage: v }))}
            options={[
              { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' }, { value: 'de', label: 'German' },
              { value: 'ja', label: 'Japanese' }, { value: 'ko', label: 'Korean' },
              { value: 'zh', label: 'Chinese' }, { value: 'ar', label: 'Arabic' },
              { value: 'hi', label: 'Hindi' }, { value: 'pt', label: 'Portuguese' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Subtitle Font Size">
          <GlassSelect
            value={settings.subtitleFontSize}
            onValueChange={(v) => setSettings((p) => ({ ...p, subtitleFontSize: v }))}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
              { value: 'xlarge', label: 'Extra Large' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Subtitle Color">
          <GlassSelect
            value={settings.subtitleColor}
            onValueChange={(v) => setSettings((p) => ({ ...p, subtitleColor: v }))}
            options={[
              { value: 'white', label: 'White' },
              { value: 'yellow', label: 'Yellow' },
              { value: 'cyan', label: 'Cyan' },
              { value: 'green', label: 'Green' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   NOTIFICATIONS TAB
   ================================================================ */
function NotificationsTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Push Notifications" icon={<Bell className="w-4 h-4" />} />

        <SettingRow label="Push Notifications" description="Enable push notification service">
          <Switch checked={settings.pushNotifications} onCheckedChange={(v) => setSettings((p) => ({ ...p, pushNotifications: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="New Release Alerts" description="Get notified about new content">
          <Switch checked={settings.newReleaseAlerts} onCheckedChange={(v) => setSettings((p) => ({ ...p, newReleaseAlerts: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Watchlist Movie Alerts" description="Alert when watchlist titles are available">
          <Switch checked={settings.watchlistAlerts} onCheckedChange={(v) => setSettings((p) => ({ ...p, watchlistAlerts: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Recommendation Alerts" description="Personalized content suggestions">
          <Switch checked={settings.recommendationAlerts} onCheckedChange={(v) => setSettings((p) => ({ ...p, recommendationAlerts: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="System Alerts" description="Important system notifications">
          <Switch checked={settings.systemAlerts} onCheckedChange={(v) => setSettings((p) => ({ ...p, systemAlerts: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Notification Badge" description="Show unread count badge">
          <Switch checked={settings.notificationBadge} onCheckedChange={(v) => setSettings((p) => ({ ...p, notificationBadge: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Quiet Hours" icon={<Moon className="w-4 h-4" />} />

        <SettingRow label="Enable Quiet Hours" description="Mute notifications during set hours">
          <Switch checked={settings.quietHoursEnabled} onCheckedChange={(v) => setSettings((p) => ({ ...p, quietHoursEnabled: v }))} />
        </SettingRow>
        {settings.quietHoursEnabled && (
          <>
            <Separator className="bg-white/5" />
            <SettingRow label="Start Time">
              <Input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => setSettings((p) => ({ ...p, quietHoursStart: e.target.value }))}
                className="glass-input bg-black/80 backdrop-blur-xl border-[var(--glass-border)] text-sm text-[var(--foreground)]"
              />
            </SettingRow>
            <Separator className="bg-white/5" />
            <SettingRow label="End Time">
              <Input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => setSettings((p) => ({ ...p, quietHoursEnd: e.target.value }))}
                className="glass-input bg-black/80 backdrop-blur-xl border-[var(--glass-border)] text-sm text-[var(--foreground)]"
              />
            </SettingRow>
          </>
        )}
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Notification Settings" icon={<Settings className="w-4 h-4" />} />

        <SettingRow label="Notification Sound" description="Sound for incoming notifications">
          <GlassSelect
            value={settings.notificationSound}
            onValueChange={(v) => setSettings((p) => ({ ...p, notificationSound: v }))}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'soft', label: 'Soft' },
              { value: 'chime', label: 'Chime' },
              { value: 'none', label: 'None' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   PRIVACY TAB
   ================================================================ */
function PrivacyTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  const handleClearHistory = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      toast.success('Watch history cleared');
    } catch {
      toast.error('Failed to clear history');
    }
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Cache cleared. Please reload the page.');
    }
  };

  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Profile Visibility" icon={<Eye className="w-4 h-4" />} />

        <SettingRow label="Profile Visibility" description="Who can see your profile">
          <GlassSelect
            value={settings.profileVisibility}
            onValueChange={(v) => setSettings((p) => ({ ...p, profileVisibility: v }))}
            options={[
              { value: 'private', label: 'Private' },
              { value: 'friends', label: 'Friends Only' },
              { value: 'public', label: 'Public' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Show Watch History to Others">
          <Switch checked={settings.showWatchHistory} onCheckedChange={(v) => setSettings((p) => ({ ...p, showWatchHistory: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Show Watchlist to Others">
          <Switch checked={settings.showWatchlist} onCheckedChange={(v) => setSettings((p) => ({ ...p, showWatchlist: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Show Online Status">
          <Switch checked={settings.showOnlineStatus} onCheckedChange={(v) => setSettings((p) => ({ ...p, showOnlineStatus: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Data & Security" icon={<Lock className="w-4 h-4" />} />

        <SettingRow label="Data Collection for Recommendations" description="Allow usage data for personalization">
          <Switch checked={settings.dataCollection} onCheckedChange={(v) => setSettings((p) => ({ ...p, dataCollection: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Two-Factor Authentication" description="Add extra security to your account">
          <Switch checked={settings.twoFactorAuth} onCheckedChange={(v) => setSettings((p) => ({ ...p, twoFactorAuth: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Login Notifications" description="Get notified of new logins">
          <Switch checked={settings.loginNotifications} onCheckedChange={(v) => setSettings((p) => ({ ...p, loginNotifications: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Data Management" icon={<Trash className="w-4 h-4" />} />

        <SettingRow label="Clear Watch History" description="Remove all your watch history">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-[var(--glass-border)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--foreground)]">Clear Watch History?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--muted-foreground)]">This action cannot be undone. All watch history will be permanently deleted.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--glass-border)] text-[var(--foreground)]">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory} className="bg-red-500 hover:bg-red-600">Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Clear Search History" description="Remove all search queries">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-[var(--glass-border)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--foreground)]">Clear Search History?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--muted-foreground)]">This will remove all your search history.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--glass-border)] text-[var(--foreground)]">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success('Search history cleared')} className="bg-red-500 hover:bg-red-600">Clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Clear All Cache" description="Remove cached data and temporary files">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-[var(--glass-border)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--foreground)]">Clear All Cache?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--muted-foreground)]">This will clear local storage and cached data. You may need to reload the page.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--glass-border)] text-[var(--foreground)]">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCache} className="bg-red-500 hover:bg-red-600">Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   DOWNLOADS TAB
   ================================================================ */
function DownloadsTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Download Settings" icon={<Download className="w-4 h-4" />} />

        <SettingRow label="Default Download Quality">
          <GlassSelect
            value={settings.downloadQuality}
            onValueChange={(v) => setSettings((p) => ({ ...p, downloadQuality: v }))}
            options={[
              { value: '4k', label: '4K' },
              { value: '1080p', label: '1080p' },
              { value: '720p', label: '720p' },
              { value: '480p', label: '480p' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Download Path">
          <div className="flex items-center gap-2">
            <GlassInput value={settings.downloadPath || '~/Downloads'} onChange={(v) => setSettings((p) => ({ ...p, downloadPath: v }))} className="w-full sm:w-48" />
            <Button variant="outline" size="sm" className="border-[var(--glass-border)] text-[var(--foreground)] shrink-0">
              <FolderOpen className="w-3 h-3" />
            </Button>
          </div>
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Auto-Delete After Watching" description="Remove downloads after playback">
          <Switch checked={settings.autoDeleteWatched} onCheckedChange={(v) => setSettings((p) => ({ ...p, autoDeleteWatched: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Wi-Fi Only Downloads" description="Only download on Wi-Fi networks">
          <Switch checked={settings.wifiOnlyDownloads} onCheckedChange={(v) => setSettings((p) => ({ ...p, wifiOnlyDownloads: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Download Notification" description="Notify when downloads complete">
          <Switch checked={settings.downloadNotification} onCheckedChange={(v) => setSettings((p) => ({ ...p, downloadNotification: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Auto-Download New Episodes" description="Download new episodes automatically">
          <Switch checked={settings.autoDownloadEpisodes} onCheckedChange={(v) => setSettings((p) => ({ ...p, autoDownloadEpisodes: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Download Limits" icon={<Gauge className="w-4 h-4" />} />

        <SettingRow label="Maximum Concurrent Downloads" description="Number of simultaneous downloads">
          <GlassSelect
            value={String(settings.maxConcurrentDownloads)}
            onValueChange={(v) => setSettings((p) => ({ ...p, maxConcurrentDownloads: Number(v) }))}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '5', label: '5' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label={`Maximum Download Storage: ${settings.maxDownloadStorage}GB`}>
          <div className="w-full sm:w-64">
            <Slider
              value={[settings.maxDownloadStorage]}
              min={1} max={50} step={1}
              onValueChange={(v) => setSettings((p) => ({ ...p, maxDownloadStorage: v[0] }))}
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
              <span>1GB</span><span>50GB</span>
            </div>
          </div>
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   ACCESSIBILITY TAB
   ================================================================ */
function AccessibilityTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Visual Accessibility" icon={<Accessibility className="w-4 h-4" />} />

        <SettingRow label="High Contrast Mode" description="Increase contrast for better visibility">
          <Switch checked={settings.highContrast} onCheckedChange={(v) => setSettings((p) => ({ ...p, highContrast: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Large Text" description="Increase font size throughout the app">
          <Switch checked={settings.largeText} onCheckedChange={(v) => setSettings((p) => ({ ...p, largeText: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Color Blindness Mode" description="Adjust colors for color vision deficiency">
          <GlassSelect
            value={settings.colorBlindness}
            onValueChange={(v) => setSettings((p) => ({ ...p, colorBlindness: v }))}
            options={[
              { value: 'none', label: 'None' },
              { value: 'protanopia', label: 'Protanopia' },
              { value: 'deuteranopia', label: 'Deuteranopia' },
              { value: 'tritanopia', label: 'Tritanopia' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Focus Indicators" description="Show visible focus rings on interactive elements">
          <Switch checked={settings.focusIndicators} onCheckedChange={(v) => setSettings((p) => ({ ...p, focusIndicators: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Assistive Technology" icon={<Ear className="w-4 h-4" />} />

        <SettingRow label="Screen Reader Support" description="Optimize for screen reader usage">
          <Switch checked={settings.screenReader} onCheckedChange={(v) => setSettings((p) => ({ ...p, screenReader: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Closed Captions" description="Enable captions for all media">
          <Switch checked={settings.closedCaptions} onCheckedChange={(v) => setSettings((p) => ({ ...p, closedCaptions: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Audio Descriptions" description="Enable audio descriptions for the visually impaired">
          <Switch checked={settings.audioDescriptions} onCheckedChange={(v) => setSettings((p) => ({ ...p, audioDescriptions: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Keyboard Navigation" description="Enhanced keyboard shortcuts and navigation">
          <Switch checked={settings.keyboardNavigation} onCheckedChange={(v) => setSettings((p) => ({ ...p, keyboardNavigation: v }))} />
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   LANGUAGE TAB
   ================================================================ */
function LanguageTab({ settings, setSettings, onSave }: {
  settings: UserSettingsData; setSettings: React.Dispatch<React.SetStateAction<UserSettingsData>>; onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Language & Region" icon={<Languages className="w-4 h-4" />} />

        <SettingRow label="Interface Language" description="Language for menus and labels">
          <GlassSelect
            value={settings.interfaceLanguage}
            onValueChange={(v) => setSettings((p) => ({ ...p, interfaceLanguage: v }))}
            options={[
              { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' }, { value: 'de', label: 'German' },
              { value: 'ja', label: 'Japanese' }, { value: 'ko', label: 'Korean' },
              { value: 'zh', label: 'Chinese' }, { value: 'ar', label: 'Arabic' },
              { value: 'hi', label: 'Hindi' }, { value: 'pt', label: 'Portuguese' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Content Region" description="Regional content availability">
          <GlassSelect
            value={settings.contentRegion}
            onValueChange={(v) => setSettings((p) => ({ ...p, contentRegion: v }))}
            options={[
              { value: 'us', label: 'US' }, { value: 'uk', label: 'UK' },
              { value: 'ca', label: 'Canada' }, { value: 'au', label: 'Australia' },
              { value: 'de', label: 'Germany' }, { value: 'fr', label: 'France' },
              { value: 'jp', label: 'Japan' }, { value: 'kr', label: 'Korea' },
              { value: 'in', label: 'India' }, { value: 'br', label: 'Brazil' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Formatting" icon={<Calendar className="w-4 h-4" />} />

        <SettingRow label="Date Format">
          <GlassSelect
            value={settings.dateFormat}
            onValueChange={(v) => setSettings((p) => ({ ...p, dateFormat: v }))}
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Time Format">
          <GlassSelect
            value={settings.timeFormat}
            onValueChange={(v) => setSettings((p) => ({ ...p, timeFormat: v }))}
            options={[
              { value: '12h', label: '12 Hour' },
              { value: '24h', label: '24 Hour' },
            ]}
          />
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Temperature Unit">
          <GlassSelect
            value={settings.temperatureUnit}
            onValueChange={(v) => setSettings((p) => ({ ...p, temperatureUnit: v }))}
            options={[
              { value: 'fahrenheit', label: 'Fahrenheit' },
              { value: 'celsius', label: 'Celsius' },
            ]}
          />
        </SettingRow>
      </SettingCard>

      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   STATS TAB
   ================================================================ */
function StatsTab() {
  const [history, setHistory] = useState<{ movieTitle: string; progress: number; duration: number; watchedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalWatched = history.length;
  const totalHours = history.reduce((acc, h) => acc + (h.duration / 60 || 0), 0);
  const uniqueTitles = new Set(history.map((h) => h.movieTitle)).size;
  const completedCount = history.filter((h) => h.progress >= 0.9).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Titles Watched', value: totalWatched, icon: <Film className="w-5 h-5" /> },
          { label: 'Total Hours', value: Math.round(totalHours), icon: <Clock className="w-5 h-5" /> },
          { label: 'Unique Titles', value: uniqueTitles, icon: <Star className="w-5 h-5" /> },
          { label: 'Completed', value: completedCount, icon: <CheckCircle2 className="w-5 h-5" /> },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4 flex flex-col items-center text-center gap-2">
            <span className="text-[var(--accent-current)]">{stat.icon}</span>
            <span className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</span>
            <span className="text-xs text-[var(--muted-foreground)]">{stat.label}</span>
          </div>
        ))}
      </div>

      <SettingCard>
        <SectionHeader title="Recent Watch History" icon={<Clock className="w-4 h-4" />} />
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-current)]" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)] py-8 text-center">No watch history yet.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--foreground)] truncate">{h.movieTitle}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {new Date(h.watchedAt).toLocaleDateString()} &middot; {Math.round(h.duration)} min
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Progress value={h.progress * 100} className="w-16 h-1.5" />
                  <span className="text-xs text-[var(--muted-foreground)]">{Math.round(h.progress * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingCard>
    </div>
  );
}

/* ================================================================
   ABOUT TAB
   ================================================================ */
function AboutTab() {
  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Application Info" icon={<Info className="w-4 h-4" />} />

        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-glow bg-gradient-to-r from-[var(--accent-current)] to-[var(--accent-cyan)] bg-clip-text text-transparent">
              GemiFlix
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Your Premium Media Center</p>
          </div>
        </div>

        <SettingRow label="App Version">
          <Badge variant="outline" className="border-[var(--glass-border)] text-[var(--muted-foreground)]">1.0.0</Badge>
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Build Number">
          <Badge variant="outline" className="border-[var(--glass-border)] text-[var(--muted-foreground)]">2024.12.1</Badge>
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Framework">
          <Badge variant="outline" className="border-[var(--glass-border)] text-[var(--muted-foreground)]">Next.js 16</Badge>
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Actions" icon={<Zap className="w-4 h-4" />} />

        <SettingRow label="Check for Updates" description="Check if a newer version is available">
          <Button variant="outline" size="sm" className="border-[var(--glass-border)] text-[var(--foreground)]"
            onClick={() => toast.info('You are running the latest version!')}>
            <RefreshCw className="w-3 h-3 mr-1" /> Check
          </Button>
        </SettingRow>
        <Separator className="bg-white/5" />

        <SettingRow label="Report a Bug" description="Report issues or suggest features">
          <Button variant="outline" size="sm" className="border-[var(--glass-border)] text-[var(--foreground)]"
            onClick={() => toast.info('Bug report form coming soon!')}>
            <Bug className="w-3 h-3 mr-1" /> Report
          </Button>
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Legal" icon={<FileText className="w-4 h-4" />} />

        <div className="space-y-2">
          {[
            { label: 'Terms of Service', url: '#' },
            { label: 'Privacy Policy', url: '#' },
            { label: 'Open Source Licenses', url: '#' },
          ].map((link) => (
            <a key={link.label} href={link.url} className="flex items-center gap-2 py-2 text-sm text-[var(--accent-current)] hover:underline transition-colors">
              <ExternalLink className="w-3 h-3" />
              {link.label}
            </a>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

/* ================================================================
   ADMIN: USERS TAB
   ================================================================ */
function AdminUsersTab() {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        if (mounted.current) {
          setUsers(data.users || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted.current) setLoading(false);
      });
    return () => { mounted.current = false; };
  }, []);

  const refreshUsers = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((u) => u.id)));
    }
  };

  const updateUser = async (userId: string, data: Record<string, boolean>) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });
      refreshUsers();
      toast.success('User updated');
    } catch {
      toast.error('Failed to update user');
    }
  };

  const deleteUser = async (userId: string, name: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      refreshUsers();
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const bulkAction = async (action: 'activate' | 'suspend' | 'delete' | 'admin') => {
    for (const id of selectedIds) {
      if (action === 'delete') {
        const u = users.find((x) => x.id === id);
        await deleteUser(id, u?.name || '');
      } else if (action === 'activate') {
        await updateUser(id, { isActive: true });
      } else if (action === 'suspend') {
        await updateUser(id, { isActive: false });
      } else if (action === 'admin') {
        await updateUser(id, { isAdmin: true });
      }
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: 'text-[var(--accent-current)]' },
          { label: 'Admins', value: users.filter((u) => u.isAdmin).length, color: 'text-amber-400' },
          { label: 'Active', value: users.filter((u) => u.isActive).length, color: 'text-green-400' },
          { label: 'Suspended', value: users.filter((u) => !u.isActive).length, color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-3 text-center">
            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <SettingCard>
        {/* Search and bulk actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="glass-input bg-black/80 backdrop-blur-xl border-[var(--glass-border)] text-sm text-[var(--foreground)] pl-9"
            />
          </div>
          {selectedIds.size > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 text-xs h-7" onClick={() => bulkAction('activate')}>Activate</Button>
              <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs h-7" onClick={() => bulkAction('suspend')}>Suspend</Button>
              <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 text-xs h-7" onClick={() => bulkAction('admin')}>Make Admin</Button>
              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 text-xs h-7" onClick={() => bulkAction('delete')}>Delete</Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[var(--accent-current)]" /></div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {/* Select All */}
            <div className="flex items-center gap-3 px-2 py-1">
              <Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} />
              <span className="text-xs text-[var(--muted-foreground)]">Select All ({filtered.length})</span>
            </div>

            {filtered.map((u) => (
              <div key={u.id} className="glass-card flex flex-col sm:flex-row sm:items-center gap-3 p-3 !transform-none hover:!transform-none">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox checked={selectedIds.has(u.id)} onCheckedChange={() => toggleSelect(u.id)} />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback className="bg-[var(--accent-current)]/20 text-[var(--accent-current)] text-xs font-bold">
                      {u.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{u.name}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className={`text-[10px] h-4 px-1.5 ${u.isActive ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                      {u.isAdmin && <Badge className="text-[10px] h-4 px-1.5 bg-amber-500/20 text-amber-400">Admin</Badge>}
                      {u.isKid && <Badge className="text-[10px] h-4 px-1.5 bg-green-500/20 text-green-400">Kid</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-500/10"
                    onClick={() => updateUser(u.id, { isAdmin: !u.isAdmin })}>
                    <Shield className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-400 hover:bg-green-500/10"
                    onClick={() => updateUser(u.id, { isActive: !u.isActive })}>
                    {u.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-400 hover:bg-green-500/10"
                    onClick={() => updateUser(u.id, { isKid: !u.isKid })}>
                    <BadgeCheck className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-[var(--glass-border)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[var(--foreground)]">Delete User &ldquo;{u.name}&rdquo;?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[var(--muted-foreground)]">This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[var(--glass-border)] text-[var(--foreground)]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteUser(u.id, u.name)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingCard>
    </div>
  );
}

/* ================================================================
   ADMIN: CONTENT TAB
   ================================================================ */
function AdminContentTab() {
  const [contentSettings, setContentSettings] = useState({
    autoFetchMetadata: true,
    posterQuality: 'high',
    backdropQuality: 'high',
    trailerAutoPlay: false,
    contentRatingDisplay: true,
    ageRestrictionLabels: true,
    contentWarnings: true,
    refreshInterval: '24',
    featuredMovie: '',
    movieOfDay: '',
    importFromTmdb: '',
  });

  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title="Content Management" icon={<Film className="w-4 h-4" />} />

        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" className="bg-[var(--accent-current)] text-white">
            <Plus className="w-3 h-3 mr-1" /> Add New Movie
          </Button>
          <Button size="sm" variant="outline" className="border-[var(--glass-border)] text-[var(--foreground)]">
            <Edit3 className="w-3 h-3 mr-1" /> Edit Movie
          </Button>
          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
            <Trash2 className="w-3 h-3 mr-1" /> Delete Movie
          </Button>
        </div>

        <SettingRow label="Set Featured Movie" description="Movie shown in the hero section">
          <GlassInput value={contentSettings.featuredMovie} onChange={(v) => setContentSettings((p) => ({ ...p, featuredMovie: v }))} placeholder="Movie title" className="w-full sm:w-48" />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Movie of the Day" description="Today&apos;s featured movie">
          <GlassInput value={contentSettings.movieOfDay} onChange={(v) => setContentSettings((p) => ({ ...p, movieOfDay: v }))} placeholder="Movie title" className="w-full sm:w-48" />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Content Refresh Interval" description="How often to check for new content">
          <GlassSelect value={contentSettings.refreshInterval} onValueChange={(v) => setContentSettings((p) => ({ ...p, refreshInterval: v }))} options={[
            { value: '1', label: '1 Hour' }, { value: '6', label: '6 Hours' },
            { value: '12', label: '12 Hours' }, { value: '24', label: '24 Hours' },
          ]} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Content Settings" icon={<Settings className="w-4 h-4" />} />

        <SettingRow label="Auto-Fetch Metadata">
          <Switch checked={contentSettings.autoFetchMetadata} onCheckedChange={(v) => setContentSettings((p) => ({ ...p, autoFetchMetadata: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Poster Quality">
          <GlassSelect value={contentSettings.posterQuality} onValueChange={(v) => setContentSettings((p) => ({ ...p, posterQuality: v }))} options={[
            { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' },
          ]} />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Backdrop Quality">
          <GlassSelect value={contentSettings.backdropQuality} onValueChange={(v) => setContentSettings((p) => ({ ...p, backdropQuality: v }))} options={[
            { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' },
          ]} />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Trailer Auto-Play">
          <Switch checked={contentSettings.trailerAutoPlay} onCheckedChange={(v) => setContentSettings((p) => ({ ...p, trailerAutoPlay: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Content Rating Display">
          <Switch checked={contentSettings.contentRatingDisplay} onCheckedChange={(v) => setContentSettings((p) => ({ ...p, contentRatingDisplay: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Age Restriction Labels">
          <Switch checked={contentSettings.ageRestrictionLabels} onCheckedChange={(v) => setContentSettings((p) => ({ ...p, ageRestrictionLabels: v }))} />
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Content Warnings">
          <Switch checked={contentSettings.contentWarnings} onCheckedChange={(v) => setContentSettings((p) => ({ ...p, contentWarnings: v }))} />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SectionHeader title="Import & Collections" icon={<DownloadCloud className="w-4 h-4" />} />

        <SettingRow label="Import from TMDB">
          <Button size="sm" variant="outline" className="border-[var(--glass-border)] text-[var(--foreground)]">
            <DownloadCloud className="w-3 h-3 mr-1" /> Import
          </Button>
        </SettingRow>
        <Separator className="bg-white/5" />
        <SettingRow label="Manage Collections / Curated Lists">
          <Button size="sm" variant="outline" className="border-[var(--glass-border)] text-[var(--foreground)]">
            <ClipboardList className="w-3 h-3 mr-1" /> Manage
          </Button>
        </SettingRow>
      </SettingCard>
    </div>
  );
}

/* ================================================================
   ADMIN: GENERIC SETTINGS TAB HELPER
   ================================================================ */
function AdminGenericTab({ title, icon, settings, setSettings, fields, onSave }: {
  title: string; icon: React.ReactNode;
  settings: Record<string, unknown>;
  setSettings: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  fields: { key: string; label: string; description?: string; type: 'toggle' | 'select' | 'input' | 'textarea' | 'slider' | 'readonly'; options?: { value: string; label: string }[]; min?: number; max?: number; readOnlyValue?: string; }[];
  onSave: () => void;
}) {
  const update = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <SettingCard>
        <SectionHeader title={title} icon={icon} />
        {fields.map((f, i) => (
          <React.Fragment key={f.key}>
            {i > 0 && <Separator className="bg-white/5" />}
            {f.type === 'toggle' ? (
              <SettingRow label={f.label} description={f.description}>
                <Switch checked={!!settings[f.key]} onCheckedChange={(v) => update(f.key, v)} />
              </SettingRow>
            ) : f.type === 'select' ? (
              <SettingRow label={f.label} description={f.description}>
                <GlassSelect
                  value={String(settings[f.key] || '')}
                  onValueChange={(v) => update(f.key, v)}
                  options={f.options || []}
                />
              </SettingRow>
            ) : f.type === 'input' ? (
              <SettingRow label={f.label} description={f.description}>
                <GlassInput value={String(settings[f.key] || '')} onChange={(v) => update(f.key, v)} className="w-full sm:w-64" />
              </SettingRow>
            ) : f.type === 'textarea' ? (
              <SettingRow label={f.label} description={f.description}>
                <GlassTextarea value={String(settings[f.key] || '')} onChange={(v) => update(f.key, v)} rows={3} />
              </SettingRow>
            ) : f.type === 'slider' ? (
              <SettingRow label={`${f.label}: ${settings[f.key] || 0}`} description={f.description}>
                <div className="w-full sm:w-64">
                  <Slider value={[Number(settings[f.key] || 0)]} min={f.min || 0} max={f.max || 100} step={1} onValueChange={(v) => update(f.key, v[0])} />
                </div>
              </SettingRow>
            ) : f.type === 'readonly' ? (
              <SettingRow label={f.label}>
                <span className="text-sm text-[var(--muted-foreground)]">{f.readOnlyValue || String(settings[f.key] || 'N/A')}</span>
              </SettingRow>
            ) : null}
          </React.Fragment>
        ))}
      </SettingCard>
      <div className="flex justify-end">
        <SaveButton onClick={onSave} saving={false} saved={false} />
      </div>
    </div>
  );
}

/* ================================================================
   ADMIN: SYSTEM TAB
   ================================================================ */
function AdminSystemTab() {
  const [uptime, setUptime] = useState('0d 0h 0m');
  const [serverTime, setServerTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fields = [
    { key: 'systemStatus', label: 'System Status', type: 'readonly' as const, readOnlyValue: '● Online' },
    { key: 'uptime', label: 'Uptime', type: 'readonly' as const, readOnlyValue: uptime },
    { key: 'memoryUsage', label: 'Memory Usage', type: 'readonly' as const, readOnlyValue: '128 MB / 512 MB' },
    { key: 'cpuUsage', label: 'CPU Usage', type: 'readonly' as const, readOnlyValue: '12%' },
    { key: 'activeUsers', label: 'Active Users', type: 'readonly' as const, readOnlyValue: '1' },
    { key: 'totalUsers', label: 'Total Users', type: 'readonly' as const, readOnlyValue: '1' },
    { key: 'totalMovies', label: 'Total Movies', type: 'readonly' as const, readOnlyValue: '24' },
    { key: 'databaseSize', label: 'Database Size', type: 'readonly' as const, readOnlyValue: '4.2 MB' },
    { key: 'serverTime', label: 'Server Time', type: 'readonly' as const, readOnlyValue: serverTime },
  ];

  return (
    <div className="space-y-4">
      <AdminGenericTab
        title="System Status"
        icon={<Server className="w-4 h-4" />}
        settings={{}}
        setSettings={() => {}}
        fields={fields}
        onSave={() => {}}
      />
      <SettingCard>
        <SectionHeader title="Server Actions" icon={<Zap className="w-4 h-4" />} />
        <SettingRow label="Restart Server" description="This will restart the application server">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                <RefreshCw className="w-3 h-3 mr-1" /> Restart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-[var(--glass-border)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--foreground)]">Restart Server?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--muted-foreground)]">The server will be temporarily unavailable.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--glass-border)] text-[var(--foreground)]">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success('Server restart initiated')} className="bg-amber-500 hover:bg-amber-600">Restart</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingRow>
      </SettingCard>
    </div>
  );
}

/* ================================================================
   ADMIN: BACKUP TAB
   ================================================================ */
function AdminBackupTab() {
  const [backupSettings, setBackupSettings] = useState<Record<string, unknown>>({
    autoBackup: true,
    backupFrequency: 'weekly',
    backupRetentionCount: 7,
    lastBackup: '2024-12-01 12:00:00',
    backupStoragePath: './backups',
    backupCompression: true,
    backupEncryption: false,
  });

  const fields = [
    { key: 'autoBackup', label: 'Auto-Backup', type: 'toggle' as const, description: 'Automatically create backups' },
    { key: 'backupFrequency', label: 'Backup Frequency', type: 'select' as const, options: [
      { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' },
    ]},
    { key: 'backupRetentionCount', label: 'Backup Retention Count', type: 'slider' as const, min: 1, max: 30 },
    { key: 'lastBackup', label: 'Last Backup', type: 'readonly' as const, readOnlyValue: backupSettings.lastBackup as string },
    { key: 'backupStoragePath', label: 'Backup Storage Path', type: 'input' as const },
    { key: 'backupCompression', label: 'Backup Compression', type: 'toggle' as const },
    { key: 'backupEncryption', label: 'Backup Encryption', type: 'toggle' as const },
  ];

  return (
    <div className="space-y-4">
      <AdminGenericTab
        title="Backup Settings"
        icon={<Archive className="w-4 h-4" />}
        settings={backupSettings}
        setSettings={setBackupSettings}
        fields={fields}
        onSave={() => toast.success('Backup settings saved')}
      />
      <SettingCard>
        <SectionHeader title="Backup Actions" icon={<Zap className="w-4 h-4" />} />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-[var(--accent-current)] text-white" onClick={() => toast.success('Manual backup started')}>
            <DownloadCloud className="w-3 h-3 mr-1" /> Manual Backup
          </Button>
          <Button size="sm" variant="outline" className="border-[var(--glass-border)] text-[var(--foreground)]" onClick={() => toast.info('Backup download started')}>
            <Download className="w-3 h-3 mr-1" /> Download Latest
          </Button>
          <Button size="sm" variant="outline" className="border-[var(--glass-border)] text-[var(--foreground)]">
            <Upload className="w-3 h-3 mr-1" /> Restore from Backup
          </Button>
        </div>
      </SettingCard>
    </div>
  );
}

/* ================================================================
   EAR ICON (for Accessibility)
   ================================================================ */
function Ear(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 6v12" /><path d="M8 8v8" /><path d="M16 8v8" />
      <path d="M6 10v4" /><path d="M18 10v4" /><circle cx="12" cy="18" r="2" />
      <path d="M20 12a8 8 0 1 0-16 0" />
    </svg>
  );
}

/* LayoutGrid icon */
function LayoutGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" />
    </svg>
  );
}

/* ================================================================
   MAIN SETTINGS PAGE
   ================================================================ */
export default function SettingsPage() {
  const setView = useAppStore((s) => s.setView);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.isAdmin ?? false;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<UserSettingsData>(defaultUserSettings);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsData>(defaultAdminSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from API
  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then((r) => r.json()).catch(() => null),
      isAdmin ? fetch('/api/admin/settings').then((r) => r.json()).catch(() => null) : Promise.resolve(null),
    ]).then(([userData, adminData]) => {
      if (userData?.settings) {
        const s = userData.settings;
        setSettings((prev) => ({
          ...prev,
          displayName: s.accentColor ? prev.displayName : (user?.name || ''),
          accentColor: s.accentColor || prev.accentColor,
          themeMode: s.themeMode || prev.themeMode,
          blurIntensity: s.blurIntensity ?? prev.blurIntensity,
          noiseLevel: s.noiseLevel ?? prev.noiseLevel,
          layoutDensity: s.layoutDensity || prev.layoutDensity,
          reduceMotion: s.reduceMotion ?? prev.reduceMotion,
          showAurora: s.showAurora ?? prev.showAurora,
          showSparkles: s.showSparkles ?? prev.showSparkles,
          defaultVideoQuality: s.defaultQuality || prev.defaultVideoQuality,
          autoPlayNext: s.autoPlayNext ?? prev.autoPlayNext,
          autoPlayTrailers: s.autoPlayTrailers ?? prev.autoPlayTrailers,
          skipIntro: s.skipIntro ?? prev.skipIntro,
          skipRecap: s.skipRecap ?? prev.skipRecap,
          defaultVolume: s.defaultVolume ?? prev.defaultVolume,
          enableSubtitles: s.defaultSubtitles ?? prev.enableSubtitles,
          subtitleLanguage: s.subtitleLanguage || prev.subtitleLanguage,
          subtitleFontSize: s.subtitleSize || prev.subtitleFontSize,
          subtitleColor: s.subtitleColor || prev.subtitleColor,
          audioLanguage: s.audioLanguage || prev.audioLanguage,
          playbackSpeed: String(s.playbackSpeed || prev.playbackSpeed),
          streamingBuffer: s.streamingBuffer || prev.streamingBuffer,
          pushNotifications: s.pushNotifications ?? prev.pushNotifications,
          newReleaseAlerts: s.newReleaseAlerts ?? prev.newReleaseAlerts,
          watchlistAlerts: s.watchlistAlerts ?? prev.watchlistAlerts,
          recommendationAlerts: s.recommendationAlerts ?? prev.recommendationAlerts,
          systemAlerts: s.systemAlerts ?? prev.systemAlerts,
          profileVisibility: s.profileVisibility || prev.profileVisibility,
          showWatchHistory: s.showWatchHistory ?? prev.showWatchHistory,
          showWatchlist: s.showWatchlist ?? prev.showWatchlist,
          showOnlineStatus: s.showActivityStatus ?? prev.showOnlineStatus,
          dataCollection: s.dataCollection ?? prev.dataCollection,
          downloadQuality: s.downloadQuality || prev.downloadQuality,
          downloadPath: s.downloadPath || prev.downloadPath,
          autoDeleteWatched: s.autoDeleteWatched ?? prev.autoDeleteWatched,
          wifiOnlyDownloads: s.wifiOnlyDownloads ?? prev.wifiOnlyDownloads,
          highContrast: s.highContrast ?? prev.highContrast,
          largeText: s.largeText ?? prev.largeText,
          screenReader: s.screenReader ?? prev.screenReader,
          closedCaptions: s.closedCaptions ?? prev.closedCaptions,
          audioDescriptions: s.audioDescriptions ?? prev.audioDescriptions,
          interfaceLanguage: s.interfaceLanguage || prev.interfaceLanguage,
          contentRegion: s.contentRegion || prev.contentRegion,
        }));
      }
      if (adminData?.settings) {
        setAdminSettings((prev) => ({ ...prev, ...adminData.settings }));
      }
      setLoading(false);
    });
  }, [isAdmin, user]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accentColor: settings.accentColor,
          themeMode: settings.themeMode,
          blurIntensity: settings.blurIntensity,
          noiseLevel: settings.noiseLevel,
          layoutDensity: settings.layoutDensity,
          reduceMotion: settings.reduceMotion,
          showAurora: settings.showAurora,
          showSparkles: settings.showSparkles,
          defaultQuality: settings.defaultVideoQuality,
          autoPlayNext: settings.autoPlayNext,
          autoPlayTrailers: settings.autoPlayTrailers,
          skipIntro: settings.skipIntro,
          skipRecap: settings.skipRecap,
          defaultVolume: settings.defaultVolume,
          defaultSubtitles: settings.enableSubtitles,
          subtitleLanguage: settings.subtitleLanguage,
          subtitleSize: settings.subtitleFontSize,
          subtitleColor: settings.subtitleColor,
          audioLanguage: settings.audioLanguage,
          playbackSpeed: parseFloat(settings.playbackSpeed),
          streamingBuffer: settings.streamingBuffer,
          pushNotifications: settings.pushNotifications,
          newReleaseAlerts: settings.newReleaseAlerts,
          watchlistAlerts: settings.watchlistAlerts,
          recommendationAlerts: settings.recommendationAlerts,
          systemAlerts: settings.systemAlerts,
          profileVisibility: settings.profileVisibility,
          showWatchHistory: settings.showWatchHistory,
          showWatchlist: settings.showWatchlist,
          showActivityStatus: settings.showOnlineStatus,
          dataCollection: settings.dataCollection,
          downloadQuality: settings.downloadQuality,
          downloadPath: settings.downloadPath,
          autoDeleteWatched: settings.autoDeleteWatched,
          wifiOnlyDownloads: settings.wifiOnlyDownloads,
          highContrast: settings.highContrast,
          largeText: settings.largeText,
          screenReader: settings.screenReader,
          closedCaptions: settings.closedCaptions,
          audioDescriptions: settings.audioDescriptions,
          interfaceLanguage: settings.interfaceLanguage,
          contentRegion: settings.contentRegion,
        }),
      });
      setSaved(true);
      toast.success('Settings saved!');
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const handleSaveAdmin = useCallback(async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: adminSettings }),
      });
      setSaved(true);
      toast.success('Admin settings saved!');
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error('Failed to save admin settings');
    } finally {
      setSaving(false);
    }
  }, [adminSettings]);

  const allTabs = isAdmin ? [...userTabs, ...adminTabs] : userTabs;
  const [showAdminSection, setShowAdminSection] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'appearance': return <AppearanceTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'playback': return <PlaybackTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'notifications': return <NotificationsTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'privacy': return <PrivacyTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'downloads': return <DownloadsTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'accessibility': return <AccessibilityTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'language': return <LanguageTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
      case 'stats': return <StatsTab />;
      case 'about': return <AboutTab />;
      case 'admin-users': return <AdminUsersTab />;
      case 'admin-content': return <AdminContentTab />;
      case 'admin-platform': return (
        <AdminGenericTab
          title="Platform Settings" icon={<Monitor className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'siteName', label: 'Site Name', type: 'input' as const },
            { key: 'siteDescription', label: 'Site Description', type: 'input' as const },
            { key: 'logoUrl', label: 'Logo URL', type: 'input' as const },
            { key: 'faviconUrl', label: 'Favicon URL', type: 'input' as const },
            { key: 'contactEmail', label: 'Contact Email', type: 'input' as const },
            { key: 'supportUrl', label: 'Support URL', type: 'input' as const },
            { key: 'socialFacebook', label: 'Facebook URL', type: 'input' as const },
            { key: 'socialTwitter', label: 'Twitter URL', type: 'input' as const },
            { key: 'socialInstagram', label: 'Instagram URL', type: 'input' as const },
            { key: 'socialYouTube', label: 'YouTube URL', type: 'input' as const },
            { key: 'socialDiscord', label: 'Discord URL', type: 'input' as const },
            { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'toggle' as const, description: 'Show maintenance page to all users' },
            { key: 'maintenanceMessage', label: 'Maintenance Message', type: 'textarea' as const },
          ]}
        />
      );
      case 'admin-appearance': return (
        <AdminGenericTab
          title="Appearance Admin" icon={<Brush className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'globalAccentColor', label: 'Global Accent Color', type: 'input' as const },
            { key: 'defaultTheme', label: 'Default Theme', type: 'select' as const, options: [
              { value: 'dark', label: 'Dark' }, { value: 'oled', label: 'OLED Black' }, { value: 'dim', label: 'Dim' },
            ]},
            { key: 'allowCustomThemes', label: 'Allow Custom Themes', type: 'toggle' as const },
            { key: 'defaultBlur', label: 'Default Blur', type: 'slider' as const, min: 0, max: 40 },
            { key: 'defaultNoise', label: 'Default Noise', type: 'slider' as const, min: 0, max: 10 },
            { key: 'defaultDensity', label: 'Default Density', type: 'select' as const, options: [
              { value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'spacious', label: 'Spacious' },
            ]},
            { key: 'customCss', label: 'Custom CSS Injection', type: 'textarea' as const },
            { key: 'customJs', label: 'Custom JS Injection', type: 'textarea' as const },
            { key: 'brandColorPrimary', label: 'Brand Color Primary', type: 'input' as const },
            { key: 'brandColorSecondary', label: 'Brand Color Secondary', type: 'input' as const },
            { key: 'brandGradientStart', label: 'Brand Gradient Start', type: 'input' as const },
            { key: 'brandGradientEnd', label: 'Brand Gradient End', type: 'input' as const },
            { key: 'loadingText', label: 'Loading Screen Text', type: 'input' as const },
            { key: 'loadingAnimation', label: 'Loading Animation', type: 'select' as const, options: [
              { value: 'pulse', label: 'Pulse' }, { value: 'spin', label: 'Spin' }, { value: 'shimmer', label: 'Shimmer' },
            ]},
          ]}
        />
      );
      case 'admin-notifications': return (
        <AdminGenericTab
          title="Notification Admin" icon={<Megaphone className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'globalPushEnabled', label: 'Global Push Notifications', type: 'toggle' as const },
            { key: 'globalEmailEnabled', label: 'Global Email Notifications', type: 'toggle' as const },
            { key: 'maxNotifsPerUser', label: 'Max Notifications Per User', type: 'slider' as const, min: 1, max: 1000 },
            { key: 'notifRetentionDays', label: 'Notification Retention Days', type: 'slider' as const, min: 1, max: 365 },
            { key: 'autoClearRead', label: 'Auto-Clear Read Notifications', type: 'toggle' as const },
            { key: 'systemTemplate', label: 'System Notification Template', type: 'textarea' as const },
            { key: 'welcomeTemplate', label: 'Welcome Message Template', type: 'textarea' as const },
            { key: 'updateTemplate', label: 'Update Message Template', type: 'textarea' as const },
            { key: 'maintenanceTemplate', label: 'Maintenance Alert Template', type: 'textarea' as const },
            { key: 'customBroadcast', label: 'Custom Notification Broadcast', type: 'textarea' as const },
          ]}
        />
      );
      case 'admin-security': return (
        <AdminGenericTab
          title="Security Settings" icon={<Lock className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'slider' as const, min: 1, max: 20 },
            { key: 'lockoutDuration', label: 'Lockout Duration (minutes)', type: 'slider' as const, min: 1, max: 120 },
            { key: 'passwordMinLength', label: 'Password Min Length', type: 'slider' as const, min: 4, max: 32 },
            { key: 'passwordRequireUpper', label: 'Require Uppercase', type: 'toggle' as const },
            { key: 'passwordRequireNumbers', label: 'Require Numbers', type: 'toggle' as const },
            { key: 'passwordRequireSpecial', label: 'Require Special Characters', type: 'toggle' as const },
            { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'slider' as const, min: 5, max: 480 },
            { key: 'maxSessionsPerUser', label: 'Max Sessions Per User', type: 'slider' as const, min: 1, max: 10 },
            { key: 'ipWhitelist', label: 'IP Whitelist (comma separated)', type: 'input' as const },
            { key: 'ipBlacklist', label: 'IP Blacklist (comma separated)', type: 'input' as const },
            { key: 'rateLimiting', label: 'Rate Limiting', type: 'toggle' as const },
            { key: 'rateLimitRpm', label: 'Rate Limit (requests/min)', type: 'slider' as const, min: 1, max: 1000 },
            { key: 'enableAuditLog', label: 'Enable Audit Log', type: 'toggle' as const },
            { key: 'twoFactorRequired', label: 'Two-Factor Required (all users)', type: 'toggle' as const },
            { key: 'admin2faRequired', label: 'Admin 2FA Required', type: 'toggle' as const },
          ]}
        />
      );
      case 'admin-analytics': return (
        <AdminGenericTab
          title="Analytics Settings" icon={<Activity className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'analyticsEnabled', label: 'Analytics Enabled', type: 'toggle' as const },
            { key: 'trackPageViews', label: 'Track Page Views', type: 'toggle' as const },
            { key: 'trackSearchQueries', label: 'Track Search Queries', type: 'toggle' as const },
            { key: 'trackWatchEvents', label: 'Track Watch Events', type: 'toggle' as const },
            { key: 'trackDownloads', label: 'Track Downloads', type: 'toggle' as const },
            { key: 'dataRetentionDays', label: 'Data Retention Days', type: 'slider' as const, min: 7, max: 365 },
            { key: 'anonymizeIp', label: 'Anonymize IP Addresses', type: 'toggle' as const },
            { key: 'shareAnalyticsWithUsers', label: 'Share Analytics with Users', type: 'toggle' as const },
          ]}
        />
      );
      case 'admin-storage': return (
        <AdminGenericTab
          title="Storage Settings" icon={<HardDrive className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'maxStoragePerUser', label: 'Max Storage Per User (GB)', type: 'slider' as const, min: 1, max: 100 },
            { key: 'totalStorageLimit', label: 'Total Storage Limit (GB)', type: 'slider' as const, min: 10, max: 1000 },
            { key: 'autoCleanupOldHistory', label: 'Auto-Cleanup Old History', type: 'toggle' as const },
            { key: 'cleanupAfterDays', label: 'Cleanup After Days', type: 'slider' as const, min: 30, max: 730 },
            { key: 'maxPosterCacheSize', label: 'Max Poster Cache (GB)', type: 'slider' as const, min: 1, max: 50 },
            { key: 'maxDownloadStorage', label: 'Max Download Storage (GB)', type: 'slider' as const, min: 10, max: 500 },
            { key: 'databaseSize', label: 'Database Size', type: 'readonly' as const, readOnlyValue: '4.2 MB' },
          ]}
        />
      );
      case 'admin-api': return (
        <AdminGenericTab
          title="API Settings" icon={<Key className="w-4 h-4" />}
          settings={adminSettings} setSettings={setAdminSettings as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          onSave={handleSaveAdmin}
          fields={[
            { key: 'apiMovieBoxUrl', label: 'MovieBox API URL', type: 'input' as const },
            { key: 'apiTimeout', label: 'API Timeout (seconds)', type: 'slider' as const, min: 5, max: 120 },
            { key: 'apiRetryCount', label: 'API Retry Count', type: 'slider' as const, min: 0, max: 10 },
            { key: 'enableCaching', label: 'Enable Caching', type: 'toggle' as const },
            { key: 'cacheTtl', label: 'Cache TTL (seconds)', type: 'slider' as const, min: 60, max: 86400 },
            { key: 'proxyUrl', label: 'Proxy URL', type: 'input' as const },
            { key: 'enableRateLimit', label: 'Enable Rate Limit', type: 'toggle' as const },
            { key: 'apiRateLimit', label: 'API Rate Limit (req/min)', type: 'slider' as const, min: 10, max: 1000 },
            { key: 'apiKey', label: 'API Key', type: 'input' as const },
            { key: 'apiStatus', label: 'API Status', type: 'readonly' as const, readOnlyValue: '● Connected' },
          ]}
        />
      );
      case 'admin-system': return <AdminSystemTab />;
      case 'admin-backup': return <AdminBackupTab />;
      default: return <ProfileTab settings={settings} setSettings={setSettings} onSave={handleSave} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-current)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050505' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel !rounded-none border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4 px-4 md:px-8 py-3">
          <button
            onClick={() => setView('dashboard')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">Settings</h1>
            <p className="text-xs text-[var(--muted-foreground)] hidden sm:block">Customize your GemiFlix experience</p>
          </div>
          {saving ? (
            <Badge className="bg-[var(--accent-current)]/20 text-[var(--accent-current)]">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Saving...
            </Badge>
          ) : saved ? (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCheck className="w-3 h-3 mr-1" /> Saved
            </Badge>
          ) : null}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) / Tab bar (mobile) */}
        <nav className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-[var(--glass-border)] overflow-y-auto">
          <div className="p-4">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-2">General</p>
            <div className="space-y-0.5">
              {userTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent-current)]/15 text-[var(--accent-current)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAdminSection(!showAdminSection)}
                  className="w-full flex items-center justify-between px-2 py-2 mt-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider hover:text-[var(--foreground)] transition-colors"
                >
                  <span>Administration</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAdminSection ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showAdminSection && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5">
                        {adminTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                              activeTab === tab.id
                                ? 'bg-amber-500/15 text-amber-400 font-medium'
                                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5'
                            }`}
                          >
                            {tab.icon}
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </nav>

        {/* Mobile tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel !rounded-none border-t border-[var(--glass-border)]">
          <div className="flex overflow-x-auto scrollbar-hide px-2 py-1 gap-1">
            {allTabs.filter((t) => !t.admin || (t.admin && showAdminSection)).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent-current)]/15 text-[var(--accent-current)] font-medium'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                } ${tab.admin ? 'text-amber-400' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => setShowAdminSection(!showAdminSection)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap text-amber-400 shrink-0"
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAdminSection ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </nav>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="pb-24 md:pb-8"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
