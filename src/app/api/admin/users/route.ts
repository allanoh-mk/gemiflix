import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, AuthError } from '@/lib/auth-helper';

export async function GET(_request: NextRequest) {
  try {
    await requireAdmin(_request);

    const users = await db.user.findMany({
      include: { settings: true },
      orderBy: { createdAt: 'asc' },
    });

    // Strip passwordHash from response
    const safeUsers = users.map(({ passwordHash: _, ...rest }) => rest);

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { userId, isAdmin, isKid, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    // Prevent admin from deactivating themselves
    if (userId === admin.id && isActive === false) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 },
      );
    }

    // Prevent admin from removing their own admin status
    if (userId === admin.id && isAdmin === false) {
      return NextResponse.json(
        { error: 'Cannot remove your own admin privileges' },
        { status: 400 },
      );
    }

    const updateData: Record<string, boolean> = {};
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    if (typeof isKid === 'boolean') updateData.isKid = isKid;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      );
    }

    const target = await db.user.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const updated = await db.user.update({
      where: { id: userId },
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
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    // Prevent self-deletion
    if (userId === admin.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 },
      );
    }

    const target = await db.user.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    // Delete user (cascades to settings, history, notifications)
    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, deletedUser: { id: userId, name: target.name } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin user delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
