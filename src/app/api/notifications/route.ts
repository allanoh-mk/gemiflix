import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin, AuthError } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await db.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { userId, type, title, message } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'type, title, and message are required' },
        { status: 400 },
      );
    }

    const validTypes = ['system', 'new_release', 'recommendation', 'watchlist', 'admin'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid notification type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 },
      );
    }

    // If userId is provided, send to that specific user; otherwise send to all users
    if (userId) {
      const targetUser = await db.user.findUnique({ where: { id: userId } });
      if (!targetUser) {
        return NextResponse.json(
          { error: 'Target user not found' },
          { status: 404 },
        );
      }

      const notification = await db.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: JSON.stringify(body.data || {}),
        },
      });

      return NextResponse.json({ notification }, { status: 201 });
    } else {
      // Send to all active users
      const users = await db.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      const notifications = await db.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          type,
          title,
          message,
          data: JSON.stringify(body.data || {}),
        })),
      });

      return NextResponse.json(
        { count: notifications.count, message: `Notification sent to ${notifications.count} users` },
        { status: 201 },
      );
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notification create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
