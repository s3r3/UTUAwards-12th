'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useTranslations } from '@/lib/i18n'
import {
  LayoutDashboard, Package, BookOpen, Globe, Users, Settings, LogOut, X,
} from 'lucide-react'

const getUserMenu = (t: ReturnType<typeof useTranslations>) => [
  { name: t.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
  { name: t.dashboard.myProducts, href: '/dashboard/products', icon: Package },
  { name: t.nav.mentoring, href: '/dashboard/mentoring', icon: BookOpen },
  { name: t.nav.partners, href: '/dashboard/partners', icon: Globe },
  { name: t.dashboard.settings, href: '/dashboard/settings', icon: Settings },
]

const getAdminMenu = (t: ReturnType<typeof useTranslations>) => [
  { name: t.dashboard.adminPanel, href: '/dashboard/admin', icon: Users },
  { name: t.dashboard.adminProducts, href: '/dashboard/admin/products', icon: Package },
  { name: t.dashboard.adminUsers, href: '/dashboard/admin/users', icon: Users },
  { name: t.dashboard.adminPartners, href: '/dashboard/admin/partners', icon: Globe },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const userMenu = getUserMenu(t)
  const adminMenu = getAdminMenu(t)
  const menu = user?.role === 'ADMIN' ? [...userMenu, ...adminMenu] : userMenu

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/logoacelorahitam.png"
            alt="Acelora"
            width={120}
            height={35}
            className="block dark:hidden h-7 w-auto"
          />
          <Image
            src="/logo/logoaceloraputih.png"
            alt="Acelora"
            width={120}
            height={35}
            className="hidden dark:block h-7 w-auto"
          />
        </Link>
        <button onClick={onClose} className="md:hidden p-1 text-gray-500">
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
        {menu.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'gradient-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} /> {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
        >
          <LogOut size={20} /> {t.nav.logout}
        </button>
      </div>
    </aside>
  )
}
