import { create } from 'zustand';

export type AccentColor = 'purple' | 'cyan' | 'orange' | 'pink' | 'green' | 'red' | 'yellow' | 'blue' | 'emerald' | 'rose' | 'violet' | 'amber' | 'teal' | 'indigo' | 'lime' | 'sky';
export type Density = 'compact' | 'comfortable' | 'spacious';

interface ThemeState {
  accent: AccentColor;
  blur: number;
  noise: number;
  density: Density;
  setAccent: (accent: AccentColor) => void;
  setAccentColor: (color: string) => void;
  setBlur: (blur: number) => void;
  setNoise: (noise: number) => void;
  setDensity: (density: Density) => void;
  loadFromServer: (settings: { accent?: string; blur?: number; noise?: number; density?: string }) => void;
  applyTheme: () => void;
}

const accentColors: Record<AccentColor, string> = {
  purple: '#a855f7',
  cyan: '#06b6d4',
  orange: '#f97316',
  pink: '#ec4899',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  blue: '#3b82f6',
  emerald: '#10b981',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  teal: '#14b8a6',
  indigo: '#6366f1',
  lime: '#84cc16',
  sky: '#0ea5e9',
};

const allAccentColors = accentColors; // alias for convenience

const densityPadding: Record<Density, string> = {
  compact: '0.5rem',
  comfortable: '1rem',
  spacious: '1.5rem',
};

const densityGap: Record<Density, string> = {
  compact: '0.5rem',
  comfortable: '1rem',
  spacious: '1.5rem',
};

function loadFromStorage(): Partial<ThemeState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('gemiflix-theme');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        accent: parsed.accent || 'purple',
        blur: typeof parsed.blur === 'number' ? Math.max(0, Math.min(40, parsed.blur)) : 24,
        noise: typeof parsed.noise === 'number' ? Math.max(0, Math.min(10, parsed.noise)) : 3,
        density: parsed.density || 'comfortable',
      };
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

function persist(state: ThemeState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      'gemiflix-theme',
      JSON.stringify({
        accent: state.accent,
        blur: state.blur,
        noise: state.noise,
        density: state.density,
      }),
    );
  } catch {
    // ignore storage errors
  }
}

function applyThemeToDOM(state: { accent: AccentColor; blur: number; noise: number; density: Density }) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--accent-current', accentColors[state.accent]);
  root.style.setProperty('--glass-blur', `${state.blur}px`);
  root.style.setProperty('--glass-noise-opacity', String(state.noise / 100));
  root.style.setProperty('--card-padding', densityPadding[state.density]);
  root.style.setProperty('--grid-gap', densityGap[state.density]);
}

const defaults = loadFromStorage();

export const useThemeStore = create<ThemeState>((set, get) => ({
  accent: defaults.accent || ('purple' as AccentColor),
  blur: defaults.blur ?? 24,
  noise: defaults.noise ?? 3,
  density: defaults.density || ('comfortable' as Density),

  setAccent: (accent: AccentColor) => {
    set({ accent });
    persist(get());
    applyThemeToDOM(get());
  },

  // Accepts any color name (string) - tries to match to known accent, defaults to purple
  setAccentColor: (color: string) => {
    const validColor = (accentColors as Record<string, string>)[color]
      ? (color as AccentColor)
      : 'purple';
    set({ accent: validColor });
    persist(get());
    applyThemeToDOM(get());
  },

  setBlur: (blur: number) => {
    set({ blur: Math.max(0, Math.min(40, blur)) });
    persist(get());
    applyThemeToDOM(get());
  },

  setNoise: (noise: number) => {
    set({ noise: Math.max(0, Math.min(10, noise)) });
    persist(get());
    applyThemeToDOM(get());
  },

  setDensity: (density: Density) => {
    set({ density });
    persist(get());
    applyThemeToDOM(get());
  },

  loadFromServer: (settings) => {
    const colorName = settings.accent || get().accent;
    const validColor = (accentColors as Record<string, string>)[colorName]
      ? (colorName as AccentColor)
      : 'purple';
    const updated = {
      accent: validColor,
      blur: settings.blur ?? get().blur,
      noise: settings.noise ?? get().noise,
      density: (settings.density as Density) || get().density,
    };
    set(updated);
    persist(get());
    applyThemeToDOM(get());
  },

  applyTheme: () => {
    applyThemeToDOM(get());
  },
}));

if (typeof window !== 'undefined') {
  const state = useThemeStore.getState();
  applyThemeToDOM(state);
}

export { accentColors, allAccentColors, densityPadding, densityGap };
