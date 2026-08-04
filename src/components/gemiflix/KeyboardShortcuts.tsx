'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { usePlayerStore } from '@/lib/stores/player-store';

/**
 * Global keyboard shortcuts component.
 * Renders nothing — only attaches a document-level keydown listener.
 *
 * Shortcuts (inactive when typing in inputs/textareas):
 *   /         → Focus search input
 *   Escape    → Go back in view history
 *   ArrowLeft → Previous hero carousel slide (dashboard only)
 *   ArrowRight → Next hero carousel slide (dashboard only)
 *   m         → Toggle mute (player only)
 */
export default function KeyboardShortcuts() {
  const view = useAppStore((s) => s.view);
  const goBack = useAppStore((s) => s.goBack);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // '/' shortcut: focus search (only when not already typing)
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[aria-label="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      // All remaining shortcuts are inactive while typing
      if (isTyping) return;

      // Escape: go back in view history
      if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
        return;
      }

      // ArrowLeft / ArrowRight: hero carousel navigation (dashboard only)
      if (view === 'dashboard') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('gemiflix:hero-navigate', { detail: { direction: -1 } }));
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('gemiflix:hero-navigate', { detail: { direction: 1 } }));
          return;
        }
      }

      // m: toggle mute (player only)
      if (e.key === 'm' && view === 'player') {
        e.preventDefault();
        toggleMute();
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [view, goBack, toggleMute]);

  return null;
}
