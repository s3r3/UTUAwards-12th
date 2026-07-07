'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'

const publicMenu = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useUIStore()
  const items = useCartStore((s) => s.items)
  const t = useTranslations()
  const count = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [pathname])

  const isDark = theme === 'dark'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      backdropFilter: 'blur(20px)',
      backgroundColor: scrolled
        ? (isDark ? 'rgba(3,7,18,0.92)' : 'rgba(255,255,255,0.92)')
        : (isDark ? 'rgba(3,7,18,0.4)' : 'rgba(255,255,255,0.4)'),
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image src="/logo/logoaceloraputih.png" alt="Acelora" width={120} height={35} className="block dark:hidden h-8 w-auto" priority />
            <Image src="/logo/logoacelorahitam.png" alt="Acelora" width={120} height={35} className="hidden dark:block h-8 w-auto" priority />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {publicMenu.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.key} href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}>
                  {t.nav[item.key as keyof typeof t.nav]}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100" aria-label="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/cart" className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600">
              Login
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart size={20} />
              {count > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">{count}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">{isOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            {publicMenu.map(item => (
              <Link key={item.key} href={item.href} className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">{t.nav[item.key as keyof typeof t.nav]}</Link>
            ))}
            <Link href="/login" className="block mx-4 mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-500 text-center">Login</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
