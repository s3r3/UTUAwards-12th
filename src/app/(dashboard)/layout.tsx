'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, BookOpen, Globe, Settings, LogOut, Menu, X,
  ChevronRight, Sparkles,
} from 'lucide-react'
import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'next-auth/react'
import { useAuthStore } from '@/store/auth.store'
import DashboardChatBot from '@/components/DashboardChatBot'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produk Saya', href: '/dashboard/products', icon: Package },
  { name: 'Mentoring', href: '/dashboard/mentoring', icon: BookOpen },
  { name: 'Mitra', href: '/dashboard/partners', icon: Globe },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

const adminItems = [
  { name: 'Panel Admin', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'Kelola Produk', href: '/dashboard/admin/products', icon: Package },
  { name: 'Kelola Pengguna', href: '/dashboard/admin/users', icon: Globe },
]

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large floating gradient orbs */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/10 to-primary-300/5 blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-ocean-500/10 to-ocean-300/5 blur-3xl"
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/8 to-pink-500/5 blur-3xl"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {/* Small floating dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary-400/30 dark:bg-primary-400/20"
          style={{
            left: `${(i * 37 + 12) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
          }}
          animate={{
            y: [0, -15 - (i % 5) * 5, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  )
}

function SidebarNav({ items, pathname, onNavigate }: { items: typeof sidebarItems; pathname: string; onNavigate: () => void }) {
  return (
    <nav className="p-3 space-y-0.5">
      {items.map((item, i) => {
        const isActive = pathname === item.href
        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl gradient-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <item.icon size={18} />
                {item.name}
              </span>
              {isActive && (
                <motion.span
                  className="relative z-10 ml-auto"
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <ChevronRight size={14} className="text-white/70" />
                </motion.span>
              )}
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  useAuth()
  const { user, logout } = useAuthStore()
  const mainRef = useRef<HTMLDivElement>(null)

  // Close sidebar on route change (mobile)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex relative">
      <FloatingOrbs />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-800/80 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/80 dark:border-gray-800/80">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20"
            >
              <span className="text-white font-bold text-lg">M</span>
            </motion.div>
            <div>
              <Image
                src="/logo/logoacelorahitam.png"
                alt="Acelora"
                width={100}
                height={30}
                className="block dark:hidden h-6 w-auto"
              />
              <Image
                src="/logo/logoaceloraputih.png"
                alt="Acelora"
                width={100}
                height={30}
                className="hidden dark:block h-6 w-auto"
              />
              <p className="text-[9px] text-gray-400 dark:text-gray-500 tracking-widest uppercase">Dashboard</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <SidebarNav items={sidebarItems} pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
        
        {user?.role === 'ADMIN' && (
          <div className="px-3 pt-4 mt-2 border-t border-gray-200/80 dark:border-gray-800/80">
            <p className="px-3 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Admin</p>
            <SidebarNav items={adminItems} pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* User info bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200/80 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          {mounted && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-sm"
              >
                {user?.name?.[0] || 'U'}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { logout(); signOut({ callbackUrl: "/login" }) }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={15} /> Keluar
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 relative z-10">
        {/* Top bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 flex items-center px-4 md:px-6 gap-3"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Image
                src="/logo/logoacelorahitam.png"
                alt="Acelora"
                width={80}
                height={24}
                className="block dark:hidden h-5 w-auto"
              />
              <Image
                src="/logo/logoaceloraputih.png"
                alt="Acelora"
                width={80}
                height={24}
                className="hidden dark:block h-5 w-auto"
              />
            <ChevronRight size={12} />
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {sidebarItems.find(i => i.href === pathname)?.name || 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-1.5 text-[10px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20"
          >
            <Sparkles size={11} />
            Agro-Maritim Ecosystem
          </motion.div>

          {/* User avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            {user?.name?.[0] || 'U'}
          </motion.div>
        </motion.header>

        {/* Page content with animated entrance */}
        <main ref={mainRef} className="p-4 md:p-6 lg:p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <DashboardChatBot />
      </div>
    </div>
  )
}
