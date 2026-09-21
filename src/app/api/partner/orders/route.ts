import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== 'PARTNER') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const partnerId = session.user.id;

  try {
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status');

    const whereClause: any = {
      items: {
        some: {
          product: {
            ownerId: partnerId,
          },
        },
      },
    };

    if (statusFilter && ['New', 'Processing', 'Ready to Ship', 'Shipped', 'Completed', 'Cancelled'].includes(statusFilter)) {
      whereClause.status = statusFilter;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } }, // Buyer details
        items: {
          include: {
            product: { select: { name: true, ownerId: true, id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to a simpler format for the dashboard summary
    const formattedOrders = orders.map(order => ({
      id: order.id,
      buyer: order.user?.name || 'N/A',
      // Assuming we display the first product from this partner found in the order items for simplicity
      product: order.items.find(item => item.product.ownerId === partnerId)?.product.name || 'Unknown Product',
      quantity: order.items.map(item => item.quantity).reduce((sum: number, qty: number) => sum + qty, 0).toString(), // Sum quantities for display
      total: order.total,
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      // Add a link to the order detail page (assuming /partner/pesanan/[id])
      viewLink: `/partner/pesanan/${order.id}`,
    }));

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error('Error fetching partner orders:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
