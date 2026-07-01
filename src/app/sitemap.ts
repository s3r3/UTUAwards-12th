import type { MetadataRoute } from 'next'
import { APP_URL } from '@/constants/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_URL
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mentoring`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/business`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
