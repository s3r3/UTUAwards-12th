import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const order = await prisma.order.findFirst({
    where: { id: params.id },
    include: { items: { include: { product: true } }, address: true },
  })
  if (!order || (order.userId !== session.user.id && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: order })
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  if (!body.status) return NextResponse.json({ success: false, error: 'Status required' }, { status: 400 })
  const order = await prisma.order.update({ where: { id: params.id }, data: { status: body.status } })
  return NextResponse.json({ success: true, data: order })
}
