'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4 ">
              <Image
                src="/footer/footerhitam.png"
                alt="Acelora"
                width={160}
                height={45}
                className="block dark:hidden h-9 w-auto"
              />
              <Image
                src="/footer/footerputih.png"
                alt="Acelora"
                width={160}
                height={45}
                className="hidden dark:block h-9 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.support}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">{t.nav.products}</Link></li>
              <li><Link href="/mentoring" className="hover:text-primary-400 transition-colors">{t.nav.mentoring}</Link></li>
              <li><Link href="/partners" className="hover:text-primary-400 transition-colors">{t.nav.partners}</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.contact}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@acelora.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+62 651 123456</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Banda Aceh, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Acelora. {t.footer.rights}</p>
          <p className="text-sm mt-2">{t.hero.subtitle}</p>
        </div>
      </div>
    </footer>
  )
}
