import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';

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

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 },
      );
    }

    if (trimmedName.length > 30) {
      return NextResponse.json(
        { error: 'Name must be at most 30 characters' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { name: trimmedName },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'This name is already taken' },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await db.user.create({
      data: {
        name: trimmedName,
        passwordHash,
        avatar: '',
        bio: '',
        isAdmin: false,
        isKid: false,
        accentColor: 'purple',
        settings: {
          create: {},
        },
      },
      include: { settings: true },
    });

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
