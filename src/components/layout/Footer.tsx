'use client'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-3">Acelora</h3>
            <p className="text-gray-400 text-sm max-w-sm">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.support}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">{t.nav.products}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.contact}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> info@acelora.id</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +62 651 123456</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> {t.footer.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Acelora. {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
