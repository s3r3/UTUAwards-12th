import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/data/partnerDemo';

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

    const where: any = { ownerId: partnerId };
    if (statusFilter && ['Active', 'Draft', 'Pending Approval', 'Rejected', 'Archived'].includes(statusFilter)) {
      where.status = statusFilter;
    }

    const products = await prisma.product.findMany({
      where,
      select: { id: true, name: true, category: true, price: true, stock: true, status: true, updatedAt: true, ownerId: true, images: true },
      orderBy: { updatedAt: 'desc' },
    });

    const formattedProducts = products.map(p => ({
      ...p,
      price: formatRupiah(p.price),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.error('Error fetching partner products:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'PARTNER') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const partnerId = session.user.id;

  try {
    const body = await request.json();
    const { name, category, price, stock, origin, status = 'Draft' } = body;

    if (!name || !category || price === undefined || stock === undefined || !origin) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Only forward fields that exist on the Product model (see prisma/schema.prisma).
    const VALID_PRODUCT_FIELDS = new Set([
      'name', 'category', 'description', 'image', 'images', 'origin', 'price',
      'compareAt', 'stock', 'weight', 'packageDesign', 'status', 'legality',
      'quality', 'shipping', 'faq',
    ]);
    const data: Record<string, any> = {};
    for (const k of Object.keys(body)) {
      if (VALID_PRODUCT_FIELDS.has(k) && body[k] !== undefined) data[k] = body[k];
    }

    const newProduct = await prisma.product.create({
      data: {
        ...data,
        status,
        ownerId: partnerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating partner product:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
