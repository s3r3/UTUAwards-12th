'use client'

import Link from 'next/link'
import { Package, ShoppingBag, Users, Shield } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function AdminDashboardPage() {
  const t = useTranslations()
  const items = [
    { href: '/dashboard/admin/orders', label: t.dashboard.adminOrders, icon: ShoppingBag },
    { href: '/dashboard/admin/products', label: t.dashboard.adminProducts, icon: Package },
    { href: '/dashboard/admin/users', label: t.dashboard.adminUsers, icon: Users },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield size={24} /> {t.dashboard.adminPanel}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600"><item.icon size={24} /></div>
            <p className="font-semibold">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
