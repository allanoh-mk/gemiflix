import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, AuthError } from '@/lib/auth-helper';

/**
 * Allowed fields for updating UserSettings.
 * Only these fields can be set via the API.
 */
const ALLOWED_SETTINGS_FIELDS = [
  'accentColor',
  'themeMode',
  'blurIntensity',
  'noiseLevel',
  'layoutDensity',
  'reduceMotion',
  'showAurora',
  'showSparkles',
  'defaultQuality',
  'autoPlayNext',
  'autoPlayTrailers',
  'skipIntro',
  'skipRecap',
  'defaultVolume',
  'defaultSubtitles',
  'subtitleLanguage',
  'subtitleSize',
  'subtitleColor',
  'audioLanguage',
  'playbackSpeed',
  'emailNotifications',
  'pushNotifications',
  'newReleaseAlerts',
  'watchlistAlerts',
  'recommendationAlerts',
  'systemAlerts',
  'profileVisibility',
  'showWatchHistory',
  'showWatchlist',
  'showActivityStatus',
  'dataCollection',
  'downloadQuality',
  'downloadPath',
  'autoDeleteWatched',
  'wifiOnlyDownloads',
  'maxDownloads',
  'highContrast',
  'largeText',
  'screenReader',
  'closedCaptions',
  'audioDescriptions',
  'interfaceLanguage',
  'contentRegion',
  'subtitlePreferredLang',
  'parentalPin',
  'maxRating',
  'blockMatureContent',
  'restrictSearch',
  'autoUpdate',
  'analytics',
  'cacheSize',
  'streamingBuffer',
] as const;

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Ensure settings exist
    if (!user.settings) {
      const settings = await db.userSettings.create({
        data: { userId: user.id },
      });
      return NextResponse.json({ settings });
    }

    return NextResponse.json({ settings: user.settings });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();

    // Filter to only allowed fields
    const updateData: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_SETTINGS_FIELDS.includes(key as (typeof ALLOWED_SETTINGS_FIELDS)[number])) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid settings fields provided' },
        { status: 400 },
      );
    }

    // Upsert settings
    let settings;
    if (!user.settings) {
      settings = await db.userSettings.create({
        data: {
          userId: user.id,
          ...updateData,
        },
      });
    } else {
      settings = await db.userSettings.update({
        where: { userId: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Settings save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
