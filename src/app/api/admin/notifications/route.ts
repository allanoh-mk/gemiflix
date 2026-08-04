import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, AuthError } from '@/lib/auth-helper';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { userId, type, title, message, data } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'type, title, and message are required' },
        { status: 400 },
      );
    }

    const validTypes = ['system', 'new_release', 'recommendation', 'watchlist', 'admin'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 },
      );
    }

    const extraData = typeof data === 'object' && data !== null ? JSON.stringify(data) : '{}';

    // Send to a specific user
    if (userId) {
      const targetUser = await db.user.findUnique({ where: { id: userId } });
      if (!targetUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 },
        );
      }

      const notification = await db.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: extraData,
        },
      });

      return NextResponse.json({ notification }, { status: 201 });
    }

    // Send to all active users
    const users = await db.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No active users to notify' },
        { status: 400 },
      );
    }

    const result = await db.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        type,
        title,
        message,
        data: extraData,
      })),
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Notification sent to ${result.count} users`,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin notification send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
