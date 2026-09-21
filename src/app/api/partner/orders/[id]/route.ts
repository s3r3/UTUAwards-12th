import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user.role !== 'PARTNER') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const partnerId = session.user.id;
  const params = await context.params;
  const orderId = params.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        items: {
          include: {
            product: { select: { id: true, name: true, ownerId: true, price: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    const hasPartnerProduct = order.items.some(item => item.product.ownerId === partnerId);
    if (!hasPartnerProduct) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const partnerItems = order.items.filter(item => item.product.ownerId === partnerId);

    const formattedOrder = {
      id: order.id,
      status: order.status,
      total: order.total,
      shippingCost: order.shippingCost,
      createdAt: order.createdAt.toISOString(),
      paidAt: order.paidAt?.toISOString() || null,
      buyer: {
        name: order.user?.name || 'N/A',
        email: order.user?.email || 'N/A',
      },
      shippingAddress: order.address ? {
        name: order.address.name,
        phone: order.address.phone,
        street: order.address.street,
        city: order.address.city,
        province: order.address.province,
        postalCode: order.address.postalCode,
      } : null,
      items: partnerItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0] || null,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      timeline: [
        { label: 'Pesanan Diterima', status: 'completed', time: order.createdAt.toISOString() },
        { label: 'Pembayaran Dikonfirmasi', status: ['PAID', 'PROCESSING', 'SHIPPING', 'DELIVERED'].includes(order.status) ? 'completed' : 'pending', time: order.paidAt?.toISOString() || null },
        { label: 'Diproses', status: ['PROCESSING', 'SHIPPING', 'DELIVERED'].includes(order.status) ? 'completed' : 'pending', time: null },
        { label: 'Siap Dikirim', status: ['SHIPPING', 'DELIVERED'].includes(order.status) ? 'completed' : 'pending', time: null },
        { label: 'Dikirim', status: order.status === 'DELIVERED' ? 'completed' : 'pending', time: null },
        { label: 'Selesai', status: order.status === 'DELIVERED' ? 'completed' : 'pending', time: null },
      ],
    };

    return NextResponse.json(formattedOrder);

  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}