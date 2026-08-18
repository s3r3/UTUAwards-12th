'use client'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'
import { useUIStore } from '@/store/ui.store'

export default function Footer() {
  const t = useTranslations()
  const theme = useUIStore((s) => s.theme)
  const isDark = theme === 'dark'

  return (
    <footer className={isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-stone-700'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Image
              src={isDark ? '/footer/footerhitam.png' : '/footer/footerputih.png'}
              alt="Acelora Logo"
              width={160}
              height={50}
              className="mb-3 h-10 w-auto object-contain"
            />
            <p className="text-sm max-w-sm">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t.footer.support}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">{t.nav.products}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> info@acelora.id</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +62 651 123456</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> {t.footer.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Acelora. {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}