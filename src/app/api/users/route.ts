import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/users - admin only user list
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })
    }

    const search = request.nextUrl.searchParams.get('search') || ''
    const users = await prisma.user.findMany({
      where: search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
        : undefined,
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { products: true, orders: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({ ...u, products: u._count.products, orders: u._count.orders })),
    })
  } catch (error) {
    console.error('[api/users]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
