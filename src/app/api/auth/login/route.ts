import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password } = body;

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Name and password are required' },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { name: name.trim() },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid name or password' },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'This account has been deactivated' },
        { status: 403 },
      );
    }

    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid name or password' },
        { status: 401 },
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

    // Cookie stores user ID directly
    response.cookies.set('session_token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
