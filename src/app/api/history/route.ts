import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserIdFromCookie } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const history = await db.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { movieId, movieTitle, progress, duration } = body;

    if (!movieId || !movieTitle) {
      return NextResponse.json(
        { error: 'movieId and movieTitle are required' },
        { status: 400 },
      );
    }

    const history = await db.watchHistory.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      create: {
        userId,
        movieId,
        movieTitle,
        progress: progress ?? 0,
        duration: duration ?? 0,
      },
      update: {
        progress: progress ?? 0,
        duration: duration ?? 0,
        watchedAt: new Date(),
      },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('History save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Clear all history for the user
    await db.watchHistory.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History clear error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
