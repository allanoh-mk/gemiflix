import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'This profile is deactivated' },
        { status: 403 },
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        isAdmin: user.isAdmin,
        isKid: user.isKid,
        accentColor: user.accentColor,
        settings: user.settings,
      },
    });

    response.cookies.set('session_token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Switch profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
