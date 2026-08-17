import type { MetadataRoute } from 'next'
import { APP_URL } from '@/constants/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = APP_URL

  // Fetch all approved products for dynamic sitemap entries
  const { prisma } = await import('@/lib/prisma')
  const products = await prisma.product.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, updatedAt: true },
  })

  const productUrls = products.map((p) => ({
    url: `${base}/products/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ]
}
