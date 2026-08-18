import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SAMPLE_PRODUCTS } from '@/constants/products'

const LAND_CATEGORIES = ['COFFEE' as const, 'PATCHOULI' as const, 'SPICES' as const, 'PROCESSED' as const]
const SEA_CATEGORIES = ['SEAFOOD' as const]

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function GET() {
  try {
    const [landProducts, seaProducts] = await Promise.all([
      prisma.product.findMany({
        where: { category: { in: LAND_CATEGORIES }, status: 'APPROVED' },
        select: { id: true, name: true, price: true, image: true, category: true, origin: true },
      }),
      prisma.product.findMany({
        where: { category: { in: SEA_CATEGORIES }, status: 'APPROVED' },
        select: { id: true, name: true, price: true, image: true, category: true, origin: true },
      }),
    ])

    const fallbackLand = SAMPLE_PRODUCTS.filter((p) => (LAND_CATEGORIES as readonly string[]).includes(p.category)).map(p => ({
      id: p.id,
      name: p.name,
      price: 0,
      image: p.image ?? null,
      category: p.category,
      origin: p.origin,
    }))
    const fallbackSea = SAMPLE_PRODUCTS.filter((p) => (SEA_CATEGORIES as readonly string[]).includes(p.category)).map(p => ({
      id: p.id,
      name: p.name,
      price: 0,
      image: p.image ?? null,
      category: p.category,
      origin: p.origin,
    }))

    const land = pickRandom(landProducts) ?? pickRandom(fallbackLand)
    const sea = pickRandom(seaProducts) ?? pickRandom(fallbackSea)

    if (!land && !sea) {
      return NextResponse.json({ success: true, data: null })
    }

    const format = (p: { id: string; name: string; price: number; image: string | null; category: string; origin: string }) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image || '/images/placeholder.png',
      category: p.category,
      origin: p.origin,
    })

    return NextResponse.json({
      success: true,
      data: {
        land: land ? format(land) : null,
        sea: sea ? format(sea) : null,
      },
    })
  } catch {
    return NextResponse.json({ success: true, data: null })
  }
}