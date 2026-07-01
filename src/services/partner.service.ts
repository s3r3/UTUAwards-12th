import { prisma } from '@/lib/prisma'
import type { PartnerCategory } from '@prisma/client'

export async function getPartners(params?: { category?: PartnerCategory; country?: string }) {
  const where: any = {}
  if (params?.category) where.category = params.category
  if (params?.country) where.country = { contains: params.country, mode: 'insensitive' } as any

  return prisma.partner.findMany({ where, orderBy: { createdAt: 'desc' } })
}

export async function createPartner(data: {
  company: string
  country: string
  location: string
  category: PartnerCategory
}) {
  return prisma.partner.create({ data })
}
