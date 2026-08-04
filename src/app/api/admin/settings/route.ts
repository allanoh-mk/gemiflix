import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, AuthError } from '@/lib/auth-helper';

export async function GET(_request: NextRequest) {
  try {
    await requireAdmin(_request);

    const appSettings = await db.appSetting.findMany({
      orderBy: { key: 'asc' },
    });

    // Convert to key-value object
    const settingsMap: Record<string, string> = {};
    for (const s of appSettings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin app settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'settings must be an object with key-value pairs' },
        { status: 400 },
      );
    }

    // Upsert each setting
    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        db.appSetting.upsert({
          where: { key },
          create: { key, value: String(value) },
          update: { value: String(value) },
        }),
      ),
    );

    // Convert results to key-value map
    const updated: Record<string, string> = {};
    for (const r of results) {
      updated[r.key] = r.value;
    }

    return NextResponse.json({ settings: updated });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin app settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
