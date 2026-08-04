import { db } from '@/lib/db';

export interface AuthUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isAdmin: boolean;
  isKid: boolean;
  accentColor: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    id: string;
    userId: string;
    accentColor: string;
    themeMode: string;
    blurIntensity: number;
    noiseLevel: number;
    layoutDensity: string;
    reduceMotion: boolean;
    showAurora: boolean;
    showSparkles: boolean;
    defaultQuality: string;
    autoPlayNext: boolean;
    autoPlayTrailers: boolean;
    skipIntro: boolean;
    skipRecap: boolean;
    defaultVolume: number;
    defaultSubtitles: boolean;
    subtitleLanguage: string;
    subtitleSize: string;
    subtitleColor: string;
    audioLanguage: string;
    playbackSpeed: number;
    emailNotifications: boolean;
    pushNotifications: boolean;
    newReleaseAlerts: boolean;
    watchlistAlerts: boolean;
    recommendationAlerts: boolean;
    systemAlerts: boolean;
    profileVisibility: string;
    showWatchHistory: boolean;
    showWatchlist: boolean;
    showActivityStatus: boolean;
    dataCollection: boolean;
    downloadQuality: string;
    downloadPath: string;
    autoDeleteWatched: boolean;
    wifiOnlyDownloads: boolean;
    maxDownloads: number;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    closedCaptions: boolean;
    audioDescriptions: boolean;
    interfaceLanguage: string;
    contentRegion: string;
    subtitlePreferredLang: string;
    parentalPin: string;
    maxRating: string;
    blockMatureContent: boolean;
    restrictSearch: boolean;
    autoUpdate: boolean;
    analytics: boolean;
    cacheSize: string;
    streamingBuffer: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

/**
 * Get the current user from the session_token cookie.
 * The cookie stores the user ID directly (simple approach).
 */
export async function getUserFromCookie(
  request: Request,
): Promise<AuthUser | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/session_token=([^;]+)/);
  const userId = match ? match[1] : null;

  if (!userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  if (!user) {
    return null;
  }

  return user as unknown as AuthUser;
}

/**
 * Get the user ID from the session_token cookie.
 */
export function getUserIdFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/session_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Require authentication — returns user or throws an error response.
 */
export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getUserFromCookie(request);
  if (!user) {
    throw new AuthError('Unauthorized', 401);
  }
  return user;
}

/**
 * Require admin authentication — returns user or throws.
 */
export async function requireAdmin(request: Request): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (!user.isAdmin) {
    throw new AuthError('Forbidden — admin access required', 403);
  }
  return user;
}

/**
 * Custom error class for auth failures.
 */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AuthError';
  }
}
