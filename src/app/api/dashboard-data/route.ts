import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // User data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    })

    // Order stats by status
    const orders = await prisma.order.findMany({
      where: { userId },
      select: { status: true },
    })

    const stats = {
      total: orders.length,
      processing: orders.filter(o => ['PENDING', 'PAID', 'PROCESSING'].includes(o.status)).length,
      shipping: orders.filter(o => o.status === 'SHIPPING').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
    }

    // Recent orders (5 most recent)
    const recentOrdersRaw = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        items: {
          take: 1,
          select: {
            product: {
              select: { name: true, image: true },
            },
            quantity: true,
            price: true,
          },
        },
      },
    })

    const recentOrders = recentOrdersRaw.map(o => ({
      id: o.id,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      productName: o.items[0]?.product?.name || `Order #${o.id.slice(0, 8)}`,
      productImage: o.items[0]?.product?.image || null,
      quantity: o.items[0]?.quantity || 0,
      price: o.items[0]?.price || 0,
    }))

    // Product recommendations (latest 5 approved products)
    const recommendationsRaw = await prisma.product.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        owner: { select: { name: true } },
      },
    })

    const recommendations = recommendationsRaw.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      ownerName: p.owner?.name || 'Acelora',
    }))

    return NextResponse.json({
      success: true,
      data: { user, stats, recentOrders, recommendations },
    })
  } catch (error) {
    console.error('[dashboard-data]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}