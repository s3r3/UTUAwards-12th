'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, User, Shield, Package, Users } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const menuItems = [
  { href: '/dashboard', label: 'overviewTitle', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'myOrders', icon: ShoppingBag },
  { href: '/dashboard/profile', label: 'profile', icon: User },
]

const adminItems = [
  { href: '/dashboard/admin', label: 'adminPanel', icon: Shield },
  { href: '/dashboard/admin/orders', label: 'adminOrders', icon: ShoppingBag },
  { href: '/dashboard/admin/products', label: 'adminProducts', icon: Package },
  { href: '/dashboard/admin/users', label: 'adminUsers', icon: Users },
]

export default function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 min-h-screen p-4">
      <nav className="space-y-1">
        {menuItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <item.icon size={18} />
              {(t.dashboard as any)[item.label]}
            </Link>
          )
        })}
      </nav>
      {role === 'ADMIN' && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-800 my-4 pt-4">
            <p className="text-xs text-gray-500 uppercase px-3 mb-2">Admin</p>
          </div>
          <nav className="space-y-1">
            {adminItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <item.icon size={18} />
                  {(t.dashboard as any)[item.label]}
                </Link>
              )
            })}
          </nav>
        </>
      )}
    </aside>
  )
}
