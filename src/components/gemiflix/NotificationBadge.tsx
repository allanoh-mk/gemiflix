'use client';

import React, { useState, useCallback, useRef, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Play, Star, BookmarkPlus, X, Check, CheckCheck } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';

type NotificationKind = 'played' | 'rated' | 'added' | 'system' | 'new_release' | 'recommendation' | 'watchlist' | 'admin';

interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

function formatRelativeTime(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getKindIcon(kind: NotificationKind) {
  switch (kind) {
    case 'played': return <Play className="h-3.5 w-3.5 text-cyan-400" />;
    case 'rated': return <Star className="h-3.5 w-3.5 text-yellow-400" />;
    case 'added': case 'watchlist': return <BookmarkPlus className="h-3.5 w-3.5 text-purple-400" />;
    case 'system': case 'admin': return <Bell className="h-3.5 w-3.5 text-amber-400" />;
    case 'new_release': return <Play className="h-3.5 w-3.5 text-green-400" />;
    case 'recommendation': return <Star className="h-3.5 w-3.5 text-pink-400" />;
    default: return <Bell className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />;
  }
}

// Public hook for pushing notifications
let notifyListeners: Array<(n: NotificationItem) => void> = [];

export function pushNotification(kind: NotificationKind, movieTitle: string): void {
  const item: NotificationItem = {
    id: `n-${Date.now()}`,
    kind,
    title: kind === 'played' ? 'Played' : kind === 'rated' ? 'Rated' : kind === 'added' ? 'Added to list' : kind,
    message: movieTitle,
    timestamp: Date.now(),
    isRead: false,
  };
  for (const fn of notifyListeners) fn(item);
}

export default function NotificationBadge() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      const load = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/notifications');
          if (res.ok) {
            const data = await res.json();
            const loaded = (data.notifications || []).map((n: { id: string; type: string; title: string; message: string; isRead: boolean; createdAt: string }) => ({
              id: n.id,
              kind: (n.type || 'system') as NotificationKind,
              title: n.title,
              message: n.message,
              isRead: n.isRead,
              timestamp: new Date(n.createdAt).getTime(),
            }));
            startTransition(() => setNotifications(loaded));
          }
        } catch { /* ignore */ }
        setLoading(false);
      };
      load();
    }
  }, [user]);

  // Subscribe to push notifications
  useEffect(() => {
    const handler = (n: NotificationItem) => {
      setNotifications((prev) => [n, ...prev].slice(0, 50));
    };
    notifyListeners.push(handler);
    return () => { notifyListeners = notifyListeners.filter(fn => fn !== handler); };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try { await fetch('/api/notifications/mark-read', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [id] }) }); } catch { /* ignore */ }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try { await fetch('/api/notifications/mark-all-read', { method: 'PUT', headers: { 'Content-Type': 'application/json' } }); } catch { /* ignore */ }
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
        aria-label="Notifications"
      >
        <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Bell className="h-[18px] w-[18px]" />
        </motion.div>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="notification-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden sm:w-96 rounded-xl bg-black/85 backdrop-blur-xl border border-[var(--glass-border)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-[var(--muted-foreground)] hover:text-red-400 transition-colors">Clear</button>
                )}
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-10"><div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent-current)]/30 border-t-[var(--accent-current)]" /></div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                  <Bell className="h-6 w-6 text-white/15" />
                  <p className="text-sm text-[var(--muted-foreground)]">No notifications</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map(n => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12, height: 0, padding: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`group flex items-start gap-3 border-b border-white/[0.03] px-4 py-3 last:border-b-0 cursor-pointer transition-colors hover:bg-white/5 ${!n.isRead ? 'bg-[var(--accent-current)]/[0.03]' : ''}`}
                      onClick={() => { if (!n.isRead) markAsRead(n.id); }}
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                        {getKindIcon(n.kind)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`truncate text-sm ${n.isRead ? 'text-[var(--muted-foreground)]' : 'text-[var(--foreground)] font-medium'}`}>{n.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-[var(--muted-foreground)]">{n.message}</p>
                        <p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">{formatRelativeTime(n.timestamp)}</p>
                      </div>
                      {!n.isRead && (
                        <button onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--accent-current)] transition-colors" aria-label="Mark as read">
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
