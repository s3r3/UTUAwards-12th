'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'

const publicMenu = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Mentoring', href: '/mentoring' },
  { name: 'Partners', href: '/partners' },
  { name: 'Business', href: '/business' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useUIStore()

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Navbar slide down from top */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          backgroundColor: scrolled
            ? theme === 'dark'
              ? 'rgba(3, 7, 18, 0.92)'
              : 'rgba(255, 255, 255, 0.92)'
            : theme === 'dark'
            ? 'rgba(3, 7, 18, 0.4)'
            : 'rgba(255, 255, 255, 0.4)',
          borderBottom: scrolled
            ? theme === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(0,0,0,0.08)'
            : '1px solid transparent',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--ocean-500) 100%)',
                  boxShadow: '0 4px 15px rgba(34,197,94,0.35)',
                }}
              >
                <span className="text-white font-bold text-lg leading-none">M</span>
              </motion.div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold text-lg bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, var(--primary-600), var(--ocean-500), var(--primary-600))',
                    backgroundSize: '200% auto',
                    animation: 'gradientShift 4s linear infinite',
                  }}
                >
                  Metuah Hub
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase">
                  Agro-Maritim Aceh
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-0.5">
              {publicMenu.map((item, i) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.3, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      style={{
                        color: isActive
                          ? 'var(--primary-600)'
                          : theme === 'dark'
                          ? '#d1d5db'
                          : '#374151',
                      }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="relative p-2 rounded-lg overflow-hidden"
                style={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151',
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'light' ? (
                    <motion.span
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Moon size={18} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Sun size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Login CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--ocean-500) 100%)',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                  }}
                >
                  Login
                </Link>
              </motion.div>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-1">
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg"
                style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'light' ? (
                    <motion.span key="moon-m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="block">
                      <Moon size={18} />
                    </motion.span>
                  ) : (
                    <motion.span key="sun-m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="block">
                      <Sun size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg"
                style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="block">
                      <X size={22} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="block">
                      <Menu size={22} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
              style={{
                borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {publicMenu.map((item, i) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                        style={{
                          color: isActive ? 'var(--primary-600)' : theme === 'dark' ? '#d1d5db' : '#374151',
                          backgroundColor: isActive
                            ? 'rgba(34,197,94,0.10)'
                            : 'transparent',
                        }}
                      >
                        {item.name}
                        {isActive && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--primary-500)' }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: publicMenu.length * 0.04, duration: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--ocean-500) 100%)',
                    }}
                  >
                    Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Gradient shift keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </>
  )
}
