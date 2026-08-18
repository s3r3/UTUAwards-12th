'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sun, Moon, User, LogOut, ListOrdered, Package, Globe, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import CartDrawer, { type UpsellProduct } from '@/components/CartDrawer'
import { useUIStore } from '@/store/ui.store'
import { useCartStore } from '@/store/cart.store'
import { useI18NStore } from '@/lib/i18n'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { key: 'shop', href: '/products', label: 'SHOP' },
  { key: 'contact', href: '/contact', label: 'CONTACT US' },
]

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isCartOpen, setCartOpen] = useState(false)
  const [upsellLand, setUpsellLand] = useState<UpsellProduct | null>(null)
  const [upsellSea, setUpsellSea] = useState<UpsellProduct | null>(null)
  const pathname = usePathname()
  const { theme, setTheme } = useUIStore()
  const items = useCartStore((s) => s.items)
  const { data: session } = useSession()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const isDark = theme === 'dark'
  const lang = useI18NStore((s) => s.lang)
  const setLang = useI18NStore((s) => s.setLang)

  // Scroll detection for navbar solid/transparent transition
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [])

  // Fetch upsell products (land + sea)
  useEffect(() => {
    fetch('/api/products/upsell')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setUpsellLand(res.data.land ?? null)
          setUpsellSea(res.data.sea ?? null)
        }
      })
      .catch(() => {})
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled
          ? isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(250, 247, 242, 0.95)'
          : isDark ? 'rgba(15, 23, 42, 0.35)' : 'rgba(250, 247, 242, 0.35)',
        borderBottom: scrolled
          ? isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? isDark ? '0 1px 40px rgba(0,0,0,0.3)' : '0 1px 40px rgba(0,0,0,0.06)'
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: SHOP */}
          <div className="flex items-center gap-6">
            {NAV_LINKS.filter((l) => l.key === 'shop').map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group relative px-1 py-1 text-sm font-semibold uppercase tracking-widest transition-colors duration-300"
                  style={{
                    color: scrolled
                      ? isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)'
                      : isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)',
                  }}
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-300 group-hover:w-full"
                    style={{ width: active ? '100%' : '0%' }}
                  />
                </Link>
              )
            })}
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center group">
            <Image
              src={isDark ? '/logo/logoacelorahitam.png' : '/logo/logoaceloraputih.png'}
              alt="Acelora Logo"
              width={130}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right: CONTACT + utilities */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.filter((l) => l.key === 'contact').map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group relative hidden md:block px-1 py-1 text-sm font-semibold uppercase tracking-widest transition-colors duration-300"
                style={{
                  color: scrolled
                    ? isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)'
                    : isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)',
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-300 group-hover:w-full"
                  style={{ width: isActive(item.href) ? '100%' : '0%' }}
                />
              </Link>
            ))}

            {/* Vertical divider */}
            <span
              className="hidden md:inline-block w-px h-5 mx-2"
              style={{ backgroundColor: scrolled ? 'rgba(100,116,139,0.4)' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(100,116,139,0.4)' }}
            />

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="relative flex items-center gap-1 px-2 py-2 rounded-xl transition-colors duration-300 text-xs font-semibold uppercase tracking-wider"
              style={{
                color: scrolled
                  ? isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)'
                  : isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)',
              }}
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{lang === 'id' ? 'EN' : 'ID'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative p-2 rounded-xl transition-colors duration-300"
              style={{
                color: scrolled
                  ? isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)'
                  : isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)',
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center rounded-xl p-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
              style={{
                color: scrolled
                  ? isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)'
                  : isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)',
              }}
              aria-label="Open cart"
            >
              <Package size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            {/* Auth */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl transition-colors duration-300"
                  style={{
                    color: scrolled
                      ? isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)'
                      : isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)',
                  }}
                >
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.[0] || 'U'}
                  </span>
                  <ChevronDown size={14} className="hidden sm:block" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 z-50 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <ListOrdered size={16} /> Pesanan Saya
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Package size={16} /> Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <User size={16} /> Profil
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 shadow-lg transition-all"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>

    <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} upsellLand={upsellLand} upsellSea={upsellSea} />
    </>
  )
}