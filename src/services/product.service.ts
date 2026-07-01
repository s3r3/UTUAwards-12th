import { prisma } from '@/lib/prisma'
import type { ProductCategory, ProductStatus } from '@prisma/client'

export async function getProducts(params?: {
  category?: ProductCategory
  status?: ProductStatus
  search?: string
  ownerId?: string
}) {
  const where: any = {}
  if (params?.category) where.category = params.category
  if (params?.status) where.status = params.status
  if (params?.ownerId) where.ownerId = params.ownerId
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  return prisma.product.findMany({
    where,
    include: { owner: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createProduct(data: {
  name: string
  category: ProductCategory
  description: string
  image?: string
  origin: string
  legality?: string
  ownerId: string
}) {
  return prisma.product.create({ data: { ...data, status: 'PENDING' } })
}

export async function updateProduct(id: string, data: Partial<{
  name: string
  category: ProductCategory
  description: string
  image: string
  origin: string
  status: ProductStatus
  legality: string
}>) {
  return prisma.product.update({ where: { id }, data })
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, email: true } } },
  })
}
