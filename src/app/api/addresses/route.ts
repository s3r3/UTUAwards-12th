import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const addresses = await prisma.address.findMany({ where: { userId: session.user.id }, orderBy: { isDefault: 'desc' } })
  return NextResponse.json({ success: true, data: addresses })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { name, phone, street, city, province, postalCode, label, isDefault } = body
  if (!name || !phone || !street || !city || !province || !postalCode) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }
  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
  }
  const address = await prisma.address.create({
    data: { userId: session.user.id, name, phone, street, city, province, postalCode, label, isDefault: isDefault || false },
  })
  return NextResponse.json({ success: true, data: address })
}
