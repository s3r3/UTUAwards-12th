'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, User, Settings, Shield, Package, Users, Menu, X, LogOut } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useTranslations } from '@/lib/i18n'
import { useSession, signOut } from 'next-auth/react'

const allMenuItems = [
  { href: '/dashboard', label: 'overviewTitle', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'myOrders', icon: ShoppingBag },
  { href: '/dashboard/profile', label: 'profile', icon: User },
  { href: '/dashboard/settings', label: 'settings', icon: Settings },
]

const adminMenuItems = [
  { href: '/dashboard/admin', label: 'adminPanel', icon: Shield },
  { href: '/dashboard/admin/orders', label: 'adminOrders', icon: ShoppingBag },
  { href: '/dashboard/admin/products', label: 'adminProducts', icon: Package },
  { href: '/dashboard/admin/users', label: 'adminUsers', icon: Users },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const t = useTranslations()
  const isAdmin = session?.user?.role === 'ADMIN'

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const NavLink = ({ item, isAdmin: _ad }: { item: typeof allMenuItems[0], isAdmin?: boolean }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <Link href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
        <item.icon size={18} />
        {(t.dashboard as any)[item.label]}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="font-bold text-lg">Acelora</Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1"><X size={18} /></button>
        </div>

        <nav className="p-3 space-y-1">
          {allMenuItems.map(item => <NavLink key={item.href} item={item} />)}
        </nav>

        {isAdmin && (
          <>
            <div className="px-3 pt-4 mt-2 border-t">
              <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Admin</p>
            </div>
            <nav className="px-3 space-y-1">
              {adminMenuItems.map(item => <NavLink key={item.href} item={item} isAdmin />)}
            </nav>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2"><Menu size={20} /></button>
          <div className="flex-1" />
          <span className="text-sm text-gray-500">{session?.user?.name || 'User'}</span>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
