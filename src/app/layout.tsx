import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import PublicShell from '@/components/layout/PublicShell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://acelora.id'),
  title: {
    default: 'Acelora – Agro-Maritim Aceh Ecosystem',
    template: '%s | Acelora',
  },
  description:
    'Platform digital ekosistem agro-maritim Aceh yang menghubungkan UMKM, petani, nelayan, eksportir, dan mitra internasional dalam satu ekosistem terintegrasi.',
  keywords: [
    'Aceh', 'agro-maritim', 'UMKM', 'ekspor', 'kopi gayo', 'nilam', 'seafood',
    'rempah', 'rantai pasok', 'global supply chain', 'Acelora',
  ],
  authors: [{ name: 'Acelora Team', url: 'https://acelora.id' }],
  creator: 'Acelora Team',
  publisher: 'Acelora',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Acelora – Agro-Maritim Aceh Ecosystem',
    description:
      'Platform digital ekosistem agro-maritim Aceh yang menghubungkan UMKM, petani, nelayan, eksportir, dan mitra internasional.',
    type: 'website', url: 'https://acelora.id', locale: 'id_ID', siteName: 'Acelora',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Acelora' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acelora – Agro-Maritim Aceh Ecosystem',
    description:
      'Platform digital ekosistem agro-maritim Aceh yang menghubungkan UMKM, petani, nelayan, eksportir, dan mitra internasional.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  )
}
