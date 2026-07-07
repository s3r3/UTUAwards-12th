import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { snap } from '@/lib/midtrans'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const where: any = { userId: session.user.id }
  if (status) where.status = status
  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ success: true, data: orders })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { items, addressId } = body

  if (!items?.length || !addressId) {
    return NextResponse.json({ success: false, error: 'Missing items or address' }, { status: 400 })
  }

  const productIds = items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const productMap = new Map(products.map(p => [p.id, p]))

  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 400 })
    if (product.stock < item.quantity) return NextResponse.json({ success: false, error: `${product.name} insufficient stock` }, { status: 400 })
  }

  const address = await prisma.address.findFirst({ where: { id: addressId, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })

  const total = items.reduce((sum: number, i: any) => sum + productMap.get(i.productId)!.price * i.quantity, 0)

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      addressId,
      items: { create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: productMap.get(i.productId)!.price })) },
    },
    include: { items: { include: { product: true } } },
  })

  // Create Midtrans Snap transaction
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: order.id,
      gross_amount: total,
    },
    customer_details: {
      first_name: address.name,
      phone: address.phone,
    },
    item_details: items.map((i: any) => {
      const product = productMap.get(i.productId)!
      return { id: product.id, name: product.name, price: product.price, quantity: i.quantity }
    }),
  })

  return NextResponse.json({
    success: true,
    data: {
      orderId: order.id,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    },
  })
}
