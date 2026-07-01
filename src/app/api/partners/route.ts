import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// GET /api/partners - Get all partners
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const country = searchParams.get('country')

    const where: Prisma.PartnerWhereInput = {}
    if (category) where.category = category as any
    if (country) where.country = { contains: country, mode: 'insensitive' }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: partners })
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}

// POST /api/partners - Create a new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, country, location, category } = body

    const partner = await prisma.partner.create({
      data: { company, country, location, category },
    })

    return NextResponse.json({
      success: true,
      data: partner,
      message: 'Partner created successfully',
    })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create partner' },
      { status: 500 }
    )
  }
}
