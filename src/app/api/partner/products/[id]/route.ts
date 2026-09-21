import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/data/partnerDemo';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || session.user.role !== 'PARTNER') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const partnerId = session.user.id;
  const productId = (await params).id;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        ownerId: partnerId, // Ensure ownership
      },
    });

    if (!product) {
      return new NextResponse('Product not found or not authorized', { status: 404 });
    }

    // Return product with formatted price for consistency with partnerDemo
    return NextResponse.json({
      ...product,
      price: formatRupiah(product.price),
    });

  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || session.user.role !== 'PARTNER') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const partnerId = session.user.id;
  const productId = (await params).id;

  try {
    const body = await request.json();

    // Only forward fields that exist on the Product model (see prisma/schema.prisma).
    const VALID_PRODUCT_FIELDS = new Set([
      'name', 'category', 'description', 'image', 'images', 'origin', 'price',
      'compareAt', 'stock', 'weight', 'packageDesign', 'status', 'legality',
      'quality', 'shipping', 'faq',
    ]);
    const updates: Record<string, any> = {};
    for (const key of Object.keys(body)) {
      if (VALID_PRODUCT_FIELDS.has(key) && body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // If no valid fields are present to update
    if (Object.keys(updates).length === 0) {
      return new NextResponse('No valid fields to update', { status: 400 });
    }

    // Ensure the product exists and belongs to the partner before attempting to update
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
        ownerId: partnerId,
      },
    });

    if (!existingProduct) {
      return new NextResponse('Product not found or not authorized', { status: 404 });
    }

    // Perform the update
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
        ownerId: partnerId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProduct);

  } catch (error: any) {
    console.error(`Error updating product ${productId}:`, error);
    // Handle specific Prisma errors if necessary, e.g., P2025 for not found
    if (error.code === 'P2025') {
      return new NextResponse('Product not found or not authorized', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || session.user.role !== 'PARTNER') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const partnerId = session.user.id;
  const productId = (await params).id;

  try {
    // First, check if there are any *active* orders associated with this product.
    // An order is considered active if its status is not 'Completed' or 'Cancelled'.
    const activeOrdersWithProduct = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId: productId,
          }
        },
        // Check for active order statuses
        status: {
          notIn: ['Completed', 'Cancelled'],
        },
      },
      select: { id: true, status: true },
    });

    if (activeOrdersWithProduct.length > 0) {
      return new NextResponse(
        'Cannot delete product with active associated orders. Please complete or cancel them first.',
        { status: 400 }
      );
    }

    // If no active orders, proceed with deletion.
    await prisma.product.delete({
      where: {
        id: productId,
        ownerId: partnerId, // Ensure ownership
      },
    });

    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error: any) {
    console.error(`Error deleting product ${productId}:`, error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return new NextResponse('Product not found or not authorized', { status: 404 });
    }
    // Handle other potential errors, like foreign key constraints if active order check was insufficient
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
