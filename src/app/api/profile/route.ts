import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        isAdmin: user.isAdmin,
        isKid: user.isKid,
        accentColor: user.accentColor,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return NextResponse.json(
        { error: error.message },
        { status: (error as { status: number }).status },
      );
    }
    console.error('Profile fetch error:', error);
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
    const { name, bio, avatar } = body;

    // Build update data — only include provided fields
    const updateData: Record<string, string> = {};

    if (name !== undefined) {
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
      // Check uniqueness if name changed
      if (trimmedName !== user.name) {
        const existing = await db.user.findUnique({
          where: { name: trimmedName },
        });
        if (existing) {
          return NextResponse.json(
            { error: 'This name is already taken' },
            { status: 409 },
          );
        }
      }
      updateData.name = trimmedName;
    }

    if (bio !== undefined) {
      updateData.bio = typeof bio === 'string' ? bio : '';
    }

    if (avatar !== undefined) {
      updateData.avatar = typeof avatar === 'string' ? avatar : '';
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        isAdmin: true,
        isKid: true,
        accentColor: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return NextResponse.json(
        { error: error.message },
        { status: (error as { status: number }).status },
      );
    }
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
