import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where = {
      ...(type && { type: type as any }),
      ...(status && { status: status as any }),
    }

    const mentorings = await prisma.mentoring.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, category: true, origin: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: mentorings })
  } catch (error) {
    console.error('Error fetching mentorings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch mentorings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, productId } = body

    const mentoring = await prisma.mentoring.create({
      data: { type, productId, status: 'ACTIVE' },
    })

    return NextResponse.json({ success: true, data: mentoring, message: 'Mentoring created successfully' })
  } catch (error) {
    console.error('Error creating mentoring:', error)
    return NextResponse.json({ success: false, error: 'Failed to create mentoring' }, { status: 500 })
  }
}
