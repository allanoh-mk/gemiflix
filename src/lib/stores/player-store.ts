import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  quality: string;
  isFullscreen: boolean;
  showSubtitles: boolean;
  showControls: boolean;
  _hideControlsTimer: ReturnType<typeof setTimeout> | null;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQuality: (quality: string) => void;
  toggleFullscreen: () => void;
  toggleSubtitles: () => void;
  resetPlayer: () => void;
  showControlsTemporarily: () => void;
}

const CONTROLS_HIDE_DELAY = 3000;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  quality: '1080p',
  isFullscreen: false,
  showSubtitles: false,
  showControls: true,
  _hideControlsTimer: null,

  play: () => {
    set({ isPlaying: true });
    get().showControlsTemporarily();
  },

  pause: () => {
    set({ isPlaying: false, showControls: true });
    const { _hideControlsTimer } = get();
    if (_hideControlsTimer) {
      clearTimeout(_hideControlsTimer);
      set({ _hideControlsTimer: null });
    }
  },

  seek: (time: number) => {
    set({ currentTime: Math.max(0, time) });
    get().showControlsTemporarily();
  },

  setVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ volume: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  setQuality: (quality: string) => {
    set({ quality });
  },

  toggleFullscreen: () => {
    if (typeof document === 'undefined') return;

    const currentState = get().isFullscreen;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // ignore fullscreen errors
      });
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen().catch(() => {
        // ignore fullscreen errors
      });
      set({ isFullscreen: false });
    }

    if (!currentState) {
      get().showControlsTemporarily();
    }
  },

  toggleSubtitles: () => {
    set((state) => ({ showSubtitles: !state.showSubtitles }));
    get().showControlsTemporarily();
  },

  resetPlayer: () => {
    const { _hideControlsTimer } = get();
    if (_hideControlsTimer) {
      clearTimeout(_hideControlsTimer);
    }
    set({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      quality: '1080p',
      isFullscreen: false,
      showSubtitles: false,
      showControls: true,
      _hideControlsTimer: null,
    });
  },

  showControlsTemporarily: () => {
    const { _hideControlsTimer } = get();
    if (_hideControlsTimer) {
      clearTimeout(_hideControlsTimer);
    }

    set({ showControls: true });

    const timer = setTimeout(() => {
      if (get().isPlaying) {
        set({ showControls: false });
      }
    }, CONTROLS_HIDE_DELAY);

    set({ _hideControlsTimer: timer });
  },
}));
