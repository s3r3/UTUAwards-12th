'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import {
  LayoutDashboard, Package, BookOpen, Globe, Users, Settings, LogOut, X,
} from 'lucide-react'

const userMenu = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produk Saya', href: '/dashboard/products', icon: Package },
  { name: 'Mentoring', href: '/dashboard/mentoring', icon: BookOpen },
  { name: 'Mitra', href: '/dashboard/partners', icon: Globe },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

const adminMenu = [
  { name: 'Admin Panel', href: '/dashboard/admin', icon: Users },
  { name: 'Kelola Produk', href: '/dashboard/admin/products', icon: Package },
  { name: 'Kelola Pengguna', href: '/dashboard/admin/users', icon: Users },
  { name: 'Kelola Mitra', href: '/dashboard/admin/partners', icon: Globe },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const menu = user?.role === 'ADMIN' ? [...userMenu, ...adminMenu] : userMenu

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Metuah Hub</span>
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
          <LogOut size={20} /> Keluar
        </button>
      </div>
    </aside>
  )
}
