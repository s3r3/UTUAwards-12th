'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Sun, Moon, User, Package, LogOut, ListOrdered, Globe } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useCartStore } from '@/store/cart.store'
import { useTranslations, useI18NStore } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { useSession, signOut } from 'next-auth/react'

const publicMenu = [
  { key: 'home', href: '/', label: 'Beranda', labelEn: 'Home' },
  { key: 'products', href: '/products', label: 'Produk', labelEn: 'Products' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useUIStore()
  const items = useCartStore((s) => s.items)
  const t = useTranslations()
  const { data: session } = useSession()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const isDark = theme === 'dark'
  const lang = useI18NStore((s) => s.lang)
  const setLang = useI18NStore((s) => s.setLang)

  useEffect(() => { setIsOpen(false); setProfileOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        backgroundColor: isDark ? 'rgba(3,7,18,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark ? '0 1px 40px rgba(0,0,0,0.3)' : '0 1px 40px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-ocean-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              A
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              Acelora
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {publicMenu.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-xl bg-primary-50 dark:bg-primary-900/20 animate-in fade-in duration-200" />
                  )}
                  <span className="relative z-10">{t.nav[item.key as keyof typeof t.nav]}</span>
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-semibold uppercase tracking-wider"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {lang === 'id' ? 'EN' : 'ID'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-950 animate-in zoom-in duration-200">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-ocean-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {session.user.name?.[0] || 'U'}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 z-50 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl shadow-black/10 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <ListOrdered size={16} /> Pesanan Saya
                        </Link>
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <Package size={16} /> Dashboard
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <User size={16} /> Profil
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                        <button onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-ocean-500 hover:from-primary-600 hover:to-ocean-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <Link href="/cart" className="relative p-2 text-gray-600 dark:text-gray-400">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-400"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {publicMenu.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {t.nav[item.key as keyof typeof t.nav]}
                </Link>
              )
            })}
            <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
              <button
                onClick={() => { setLang(lang === 'id' ? 'en' : 'id'); setIsOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Globe size={16} /> {lang === 'id' ? 'English' : 'Indonesia'}
              </button>
              {session?.user ? (
                <>
                  <Link href="/orders" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ListOrdered size={16} /> Pesanan Saya
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Package size={16} /> Dashboard
                  </Link>
                  <button onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-ocean-500">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
