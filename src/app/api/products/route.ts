import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// GET /api/products - Get all products (with filter, sort, pagination)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort') || 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('_page') || '1', 10)
    const limit = parseInt(searchParams.get('_limit') || '12', 10)
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {}
    if (category && category !== 'all') where.category = category as Prisma.ProductWhereInput["category"]
    if (status) where.status = status as Prisma.ProductWhereInput["status"]
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { origin: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    if (sortBy === 'price_asc') orderBy.price = 'asc'
    else if (sortBy === 'price_desc') orderBy.price = 'desc'
    else if (sortBy === 'stock') orderBy.stock = 'desc'
    else orderBy.createdAt = 'desc'

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, hasNextPage: skip + products.length < total },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, description, image, origin, legality, ownerId } = body

    const product = await prisma.product.create({
      data: { name, category, description, image, origin, legality, ownerId, status: 'PENDING' },
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
