import type { MetadataRoute } from 'next'
import { APP_URL } from '@/constants/config'

export default function robots(): MetadataRoute.Robots {
  return {
    host: APP_URL,
    rules: [
      {
        // Allow all paths for the root user agent
        userAgent: '*' /*, 
        allow: ['/', '/products', '/products/*'],
        disallow: ['/admin', '/dashboard', '/login', '/register', '/api/auth', '/api/orders'],
        crawlDelay: 5,
        */
      },
      {
        // Allow specific paths for Googlebot-Image
        userAgent: 'Googlebot-Image' /*,
        allow: [
          '/images/*',
          '/products/*'
        ],
        disallow: [
          '/api/*'
        ],
        crawlDelay: 10,
        */
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}