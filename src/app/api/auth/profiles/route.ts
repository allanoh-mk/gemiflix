import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        isAdmin: true,
        isKid: true,
        accentColor: true,
        bio: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const profiles = users.map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      isAdmin: u.isAdmin,
      accentColor: u.accentColor,
      bio: u.bio,
      isActive: u.isActive,
    }));

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Profiles fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
