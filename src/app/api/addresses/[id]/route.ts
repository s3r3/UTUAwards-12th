import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const address = await prisma.address.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  if (body.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
  }
  const updated = await prisma.address.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ success: true, data: updated })
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const address = await prisma.address.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  await prisma.address.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
